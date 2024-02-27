import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import FacilityEmission from './FacilityEmission'
import { v4 as uuidv4 } from 'uuid'
import { ParsedQs } from 'qs'
import FacilityEqualityAttribute from './FacilityEqualityAttribute'

export default class FacilityProduct extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public facilityEmissionId: string

  @column()
  public name: string

  @column()
  public quantity: string

  @column()
  public functionalUnit: string

  @column({ columnName: 'scope_1_carbon_emission' })
  public scope1CarbonEmission: number

  @column({ columnName: 'scope_2_carbon_emission' })
  public scope2CarbonEmission: number

  @column({ columnName: 'scope_3_carbon_emission' })
  public scope3CarbonEmission: number

  @column()
  public equalityAttribute: boolean

  @column.dateTime({ columnName: 'deleted_at' })
  public deletedAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime


  @belongsTo(() => FacilityEmission, {
    foreignKey: 'facilityEmissionId',
  })
  public FacilityEmission: BelongsTo<typeof FacilityEmission>


  /**
 * Gets all facility products from the database.
 * Accepts query parameters to filter, sort, paginate and include relationships.
 */
  public static async getAllFacilityProducts(queryParams: ParsedQs) {
    const perPage = queryParams.per_page ? parseInt(queryParams.per_page as string, 10) : 8
    const page = queryParams.page ? parseInt(queryParams.page as string, 10) : 1
    const order = queryParams.order ? queryParams.order.toString() : 'desc'
    let includes: string[] = queryParams.include ? queryParams.include.split(',') : []
    const sort = queryParams.sort ? queryParams.sort.toString() : 'created_at'

    const facilityEmissionId = queryParams.facilityEmissionId
      ? queryParams.facilityEmissionId.toString()
      : ''

    let query = this.query().whereNull('deleted_at') // Exclude soft-deleted records;

    if (facilityEmissionId) {
      query = query
        .where('facility_emission_id', facilityEmissionId)
        .preload('FacilityEmission', (facilityEmissionQuery) => {
          facilityEmissionQuery.preload('FacilityEqualityAttribute')
        })
    }

    query = query.orderBy(sort, order)

    //::Include Relationship
    if (includes.length > 0) {
      includes.forEach((include: any) => query.preload(include.trim()))
    }

    const facilityProducts = await query.paginate(page, perPage)

    return facilityProducts
  }

  /**
* Creates facility products and related data from emission data and request data.
*
* Loops through the facilityProducts array in the request data to create a 
* product data object for each one with a new UUID. Saves the products 
* array to the database related to the emission data.
*
* If equalityAttribute is in the request data, saves a new FacilityEqualityAttribute
* related to the emission data.
*
* Returns the result of creating the facility products.
*/
  public static async createFacilityProducts(emissionData, requestData) {
    const products: any = []
    for (const element of requestData.facilityProducts) {
      const productId = uuidv4()

      // Create facility product
      const productData = {
        id: productId,
        ...element,
      }

      products.push(productData)
    }

    if (requestData.equalityAttribute) {
      // save equality attribute value
      await emissionData.related('FacilityEqualityAttribute').create({
        id: uuidv4(),
        facilityEmissionId: emissionData.id,
        equalityAttribute: requestData.equalityAttribute,
      })
    }

    let result = await emissionData.related('FacilityProducts').createMany(products)
    return result
  }

  /**
 * Gets facility product data by the given field and value.
 */
  public static async getFacilityProductData(field, value) {
    const facilityProductDetails = await this.query()
      .where(field, value)
      .whereNull('deleted_at') // Exclude soft-deleted records
      .firstOrFail()
    return facilityProductDetails
  }

  /**
 * Updates or creates facility products for the given facility emission data 
 * based on the facilityProducts array in the request data. 
 * 
 * Loops through the facilityProducts array and checks if the product ID exists.
 * If so, updates that product. If not, creates a new product.
 * 
 * Deletes any existing products for the facility that are not in the 
 * request data facilityProducts array by soft-deleting them.
 * 
 * If equalityAttribute is in the request data, updates the equality attribute 
 * value for the facility emission data.
 */
  public static async updateOrCreateFacilityProducts(
    facilityEmissionData,
    requestData,
    trx: any = undefined
  ) {
    let products: any = []
    let updateProductIds: any = []

    let allProductsOfFacility: any = facilityEmissionData.FacilityProducts?.map((item) => {
      return item.id
    })

    requestData.facilityProducts.forEach((element) => {
      var singleData: any = {}
      if (element.id) {
        singleData = { ...element }
        updateProductIds.push(element.id)
      } else {
        singleData = { id: uuidv4(), ...element }
      }
      products.push(singleData)
    })

    //:: Delete products whose ids not in requestData of update product
    const idsToDelete = await allProductsOfFacility.filter(
      (record) => !updateProductIds.includes(record)
    )

    if (idsToDelete.length !== 0) {
      // Fetch the records to be updated
      const recordsToUpdate = await this.query().whereIn('id', idsToDelete)

      // Update each record
      await Promise.all(
        recordsToUpdate.map(async (record) => {
          const newName = DateTime.now() + '_' + record.name
          // Update the record
          await this.query().where('id', record.id).update({
            name: newName,
            deletedAt: new Date(),
          })
        })
      )
    }

    // save equality attribute value
    if (requestData.equalityAttribute !== undefined) {
      await FacilityEqualityAttribute.query()
        .where('facility_emission_id', facilityEmissionData.id)
        .update({ equalityAttribute: requestData.equalityAttribute })
    }

    //:: this manage create or update using id as unique key
    const result = await facilityEmissionData
      .related('FacilityProducts', (query) => {
        query.whereNull('deleted_at') // Exclude soft-deleted records
      })
      .updateOrCreateMany(products, 'id', { client: trx })
    return result
  }

  /**
 * Calculates the carbon emission percentages for each product 
 * based on the total emissions and number of products for the facility.
 * 
 * Takes the total scope 1, 2, and 3 emissions for the facility, 
 * gets all the products for the facility, 
 * calculates the average emission per product by dividing the totals by number of products,
 * then calculates the percentage of each scope's total contributed by each product.
 * 
 * Returns an array of objects containing the product name, quantity, 
 * and emission percentages for each scope.
 */
  public static async calculateCarbonEmission(facilityEmissionData) {
    const productEmissions: {
      name: string
      quantity: string
      scope1_carbon_emission: string
      scope2_carbon_emission: string
      scope3_carbon_emission: string
    }[] = []

    const scope1TotalEmission = facilityEmissionData.scope1TotalEmission
    const scope2TotalEmission = facilityEmissionData.scope2TotalEmission
    const scope3TotalEmission = facilityEmissionData.scope3TotalEmission

    const allProducts = await this.query()
      .whereNull('deleted_at')
      .where('facility_emission_id', facilityEmissionData.id)
    const totalProducts = allProducts.length

    let scope1EmissionPerProduct = scope1TotalEmission / totalProducts
    let scope2EmissionPerProduct = scope2TotalEmission / totalProducts
    let scope3EmissionPerProduct = scope3TotalEmission / totalProducts

    allProducts.map((product, _) => {
      // const scope1CarbonEmission =
      //   ((percentagePerProduct / 100) * scope1TotalEmission).toFixed(2) + '%'
      // const scope2CarbonEmission =
      //   ((percentagePerProduct / 100) * scope2TotalEmission).toFixed(2) + '%'
      // const scope3CarbonEmission =
      //   ((percentagePerProduct / 100) * scope3TotalEmission).toFixed(2) + '%'

      const scope1CarbonEmission =
        ((scope1EmissionPerProduct / scope1TotalEmission) * 100).toFixed(2) + '%'
      const scope2CarbonEmission =
        ((scope2EmissionPerProduct / scope2TotalEmission) * 100).toFixed(2) + '%'
      const scope3CarbonEmission =
        ((scope3EmissionPerProduct / scope3TotalEmission) * 100).toFixed(2) + '%'

      // Add the calculated values to the product
      const updatedProduct = {
        id: product.id,
        name: product.name,
        quantity: product.quantity,
        scope1_carbon_emission: scope1CarbonEmission,
        scope2_carbon_emission: scope2CarbonEmission,
        scope3_carbon_emission: scope3CarbonEmission,
      }

      // Push the modified product to the result array
      productEmissions.push(updatedProduct)
    })
    return productEmissions
  }

  /**
 * Gets all unique product names from the facility emissions data. 
 * 
 * Queries the database for facility emissions data based on the provided organization ID. 
 * Preloads the related facility products data.
 * Extracts a unique array of product names from the facility products.
 * Sorts the product name array based on provided order param.
 * Returns the sorted array of unique product names.
 */
  public static async getAllProductNames(queryParams) {
    const organizationId = queryParams.organizationId ? queryParams.organizationId.toString() : ''
    const order = queryParams.order ? queryParams.order.toString() : 'desc'

    let facilityProducts: FacilityEmission[] = []
    let uniqueProductNames: string[] = []

    facilityProducts = await FacilityEmission.query()
      .whereNull('deleted_at')
      .whereHas('OrganizationFacility', (orgQuery) => {
        orgQuery.where('organization_id', organizationId)
      })
      .preload('FacilityProducts', (query) => {
        query.whereNull('deletedAt')
      })

    // Extract unique product names from the loaded data
    uniqueProductNames = Array.from(
      new Set(
        facilityProducts.reduce((acc, item) => {
          return acc.concat(item.FacilityProducts.map((product) => product.name as string))
        }, [] as string[])
      )
    )

    // Function to sort the array based on order ("asc" or "desc")
    const sortArray = (order: 'asc' | 'desc'): Array<string> => {
      return order === 'asc'
        ? [...uniqueProductNames].sort() // Use spread operator to create a copy
        : [...uniqueProductNames].sort((a, b) => b.localeCompare(a))
    }

    const sortedArray: Array<string> = sortArray(order)

    return sortedArray
  }
}

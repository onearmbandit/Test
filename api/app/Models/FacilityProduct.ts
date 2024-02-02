import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import FacilityEmission from './FacilityEmission'
import { v4 as uuidv4 } from 'uuid'
import { ParsedQs } from 'qs';

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

  //::_____Relationships Start_____:://

  @belongsTo(() => FacilityEmission, {
    foreignKey: 'facilityEmissionId',
  })
  public FacilityEmission: BelongsTo<typeof FacilityEmission>

  //::_____Relationships End_____:://

  public static async getAllFacilityProducts(queryParams: ParsedQs) {
    const perPage = queryParams.per_page ? parseInt(queryParams.per_page as string, 10) : 8;
    const page = queryParams.page ? parseInt(queryParams.page as string, 10) : 1;
    const order = queryParams.order ? queryParams.order.toString() : 'desc';
    const sort = queryParams.sort ? queryParams.sort.toString() : 'created_at';
    const facilityEmissionId = queryParams.facilityEmissionId ? queryParams.facilityEmissionId.toString() : '';

    let query = this.query().whereNull('deleted_at') // Exclude soft-deleted records;

    if (facilityEmissionId) {
      query = query.where('facility_emission_id', facilityEmissionId);
    }

    query = query.orderBy(sort, order);

    const facilityProducts = await query.paginate(page, perPage);

    return facilityProducts
  }

  public static async createFacilityProducts(emissionData, requestData) {
    let products: any = []
    requestData.facilityProducts.forEach(element => {
      let singleData = {
        id: uuidv4(),
        ...element
      }
      products.push(singleData)
    });

    let result = await emissionData.related('FacilityProducts').createMany(products);
    return result;
  }

  public static async getFacilityProductData(field, value) {
    const facilityProductDetails = await this.query()
      .where(field, value)
      .whereNull('deleted_at') // Exclude soft-deleted records
      .firstOrFail();
    return facilityProductDetails;
  }

  public static async updateOrCreateFacilityProducts(facilityEmissionData, requestData) {
    let products: any = []
    let updateProductIds: any = []

    let allProductsOfFacility: any = facilityEmissionData.FacilityProducts?.map((item) => (item.id));

    requestData.facilityProducts.forEach(element => {
      var singleData: any = {}
      if (element.id) {
        singleData = { ...element }
        updateProductIds.push(element.id)
      }
      else {
        singleData = { id: uuidv4(), ...element }
      }
      products.push(singleData)
    });

    //:: Delete products whose ids not in requestData of update product
    const idsToDelete = await allProductsOfFacility.filter((record) => !updateProductIds.includes(record));

    if (idsToDelete.length !== 0) {
      await this.query().whereIn('id', idsToDelete).update({
        'deletedAt': new Date()
      })
    }

    //:: this manage create or update using id as unique key
    const result = await facilityEmissionData
      .related('FacilityProducts', (query) => {
        query.whereNull('deleted_at'); // Exclude soft-deleted records
      })
      .updateOrCreateMany(products, 'id');
    return result;
  }

  public static async calculateCarbonEmission(facilityEmissionData) {

    const productEmissions: {
      name: string;
      quantity: string;
      scope1: string;
      scope2: string;
      scope3: string;
    }[] = [];

    const scope1TotalEmission = facilityEmissionData.scope1TotalEmission
    const scope2TotalEmission = facilityEmissionData.scope2TotalEmission
    const scope3TotalEmission = facilityEmissionData.scope3TotalEmission

    const allProducts = await this.query()
      .whereNull('deleted_at')
      .where('facility_emission_id', facilityEmissionData.id)
    const totalProducts = allProducts.length

    const percentagePerProduct = 100 / totalProducts

    allProducts.map((product, _) => {
      const scope1CarbonEmission = ((percentagePerProduct / 100) * scope1TotalEmission).toFixed(2) + '%'
      const scope2CarbonEmission = ((percentagePerProduct / 100) * scope2TotalEmission).toFixed(2) + '%'
      const scope3CarbonEmission = ((percentagePerProduct / 100) * scope3TotalEmission).toFixed(2) + '%'

      // Add the calculated values to the product
      const updatedProduct = {
        name: product.name,
        quantity: product.quantity,
        scope1: scope1CarbonEmission,
        scope2: scope2CarbonEmission,
        scope3: scope3CarbonEmission,
      };

      // Push the modified product to the result array
      productEmissions.push(updatedProduct);

    });
    return productEmissions;
  }
}

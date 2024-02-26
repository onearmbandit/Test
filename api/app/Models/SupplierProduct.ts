import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Supplier from './Supplier'
import { v4 as uuidv4 } from 'uuid'
import { ParsedQs } from 'qs'

export default class SupplierProduct extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public supplierId: string

  @column()
  public type: string

  @column()
  public name: string

  @column()
  public quantity: string

  @column()
  public functionalUnit: string

  @column()
  public scope_3Contribution: number

  @column.dateTime()
  public deletedAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  //::_____Relationships Start_____:://

  @belongsTo(() => Supplier, {
    foreignKey: 'supplierId',
  })
  public supplier: BelongsTo<typeof Supplier>

  //::_____Relationships End_____:://

  public static async createSupplierProducts(supplierData, requestData, auth) {
    let products: any = []
    requestData.supplierProducts.forEach((element) => {
      let singleData = {
        id: uuidv4(),
        ...element,
      }
      products.push(singleData)
    })
    supplierData
      .merge({
        updatedBy: `${auth.user?.firstName} ${auth.user?.lastName}`,
        updatedAt: DateTime.local(),
      })
      .save()

    let result = await supplierData.related('supplierProducts').createMany(products)
    return result
  }

  //:: If id present then update data otherwise create new data
  public static async updateOrCreateSupplierProducts(supplierData, requestData, auth) {
    let products: any = []
    let updateProductIds: any = []
    let allProductsOfSupplier: any = supplierData.supplierProducts?.map((item) => item.id)

    requestData.supplierProducts.forEach((element: any) => {
      var singleData: any = {}
      element.scope_3Contribution = element.scope_3Contribution ? element.scope_3Contribution : null
      if (element?.id && element?.id !== '') {
        singleData = { ...element }
        updateProductIds.push(element.id)
      } else {
        element.id = uuidv4()
        singleData = { ...element }
      }
      products.push(singleData)
    })


    //:: Delete products whose ids not in requestData of update product
    const idsToDelete = await allProductsOfSupplier.filter(
      (record) => !updateProductIds.includes(record)
    )
    if (idsToDelete.length !== 0) {
      await this.query().whereIn('id', idsToDelete).update({
        deletedAt: new Date(),
      })
    }

    //:: Update supplier data
    supplierData
      .merge({
        updatedBy: `${auth.user?.firstName} ${auth.user?.lastName}`,
        updatedAt: DateTime.now(),
      })
      .save()

    //:: this manage create or update using id as unique key
    let result = await supplierData.related('supplierProducts').updateOrCreateMany(products, 'id')
    return result
  }

  //:: Delete multiple supplier-products
  public static async deleteMultipleSupplierProducts(requestData) {
    await this.query().whereIn('id', requestData.products).update({
      deletedAt: new Date(),
    })
    return
  }

  public static async getAllSupplierProductsForSpecificPeriod(queryParams: ParsedQs) {
    const perPage = queryParams.perPage ? parseInt(queryParams.perPage as string, 10) : 20
    const page = queryParams.page ? parseInt(queryParams.page as string, 10) : 1
    const order = queryParams.order ? queryParams.order.toString() : 'desc'
    const sort = queryParams.sort ? queryParams.sort.toString() : 'updated_at'
    const supplyChainReportingPeriodId = queryParams.supplyChainReportingPeriodId
      ? queryParams.supplyChainReportingPeriodId.toString()
      : ''

    let query: any = this.query().whereNull('supplier_products.deleted_at') // Exclude soft-deleted records;

    if (supplyChainReportingPeriodId) {
      query = query.whereHas('supplier', (data) => {
        data.where('supplyChainReportingPeriodId', supplyChainReportingPeriodId)
      })
    }

    if (sort == 'supplierName') {
      query = query
        .join('suppliers', 'supplier_products.supplier_id', '=', 'suppliers.id')
        .orderBy('suppliers.name', order)
        .select('supplier_products.*')
    } else {
      query = query.orderBy(sort, order)
    }

    const allSupplierProductsData = await query.preload('supplier').paginate(page, perPage)

    return allSupplierProductsData
  }

  
  public static async getProductsEmissionDataForSpecificPeriod(queryParams: ParsedQs) {
    const supplyChainReportingPeriodId = queryParams.supplyChainReportingPeriodId
      ? queryParams.supplyChainReportingPeriodId.toString()
      : ''

    let query = this.query().whereNull('deleted_at') // Exclude soft-deleted records;
    if (supplyChainReportingPeriodId) {
      query.whereHas('supplier', (query) => {
        query.where('supplyChainReportingPeriodId', supplyChainReportingPeriodId)
      })
    }

    const allSupplierProductsData = await query.preload('supplier')

    return JSON.parse(JSON.stringify(allSupplierProductsData))
  }


  //::  Get all products types for specifc supplier
  public static async getAllProductTypesOfSuppliers(queryParams: ParsedQs) {
    const supplierId = queryParams.supplierId ? queryParams.supplierId.toString() : ''
    let query = this.query().whereNull('deleted_at') // Exclude soft-deleted records;
    const order = queryParams.order ? queryParams.order.toString() : 'desc'
    const sort = queryParams.sort ? queryParams.sort.toString() : 'type'

    if (supplierId) {
      query.where('supplierId', supplierId).orderBy(sort, order)
    }

    const allProductTypesOfSupplier = await query
      .distinct('supplier_id', 'type') // Specify all relevant columns or unique columns
      .groupBy('supplier_id', 'type')

    return JSON.parse(JSON.stringify(allProductTypesOfSupplier))
  }


  //:: Get all products names for specifc supplier
  public static async getAllProductNamesOfSuppliers(queryParams: ParsedQs) {
    const supplierId = queryParams.supplierId ? queryParams.supplierId.toString() : ''
    let query = this.query().whereNull('deleted_at') // Exclude soft-deleted records;
    const order = queryParams.order ? queryParams.order.toString() : 'desc'
    const sort = queryParams.sort ? queryParams.sort.toString() : 'name'

    if (supplierId) {
      query.where('supplierId', supplierId).orderBy(sort, order)
    }

    const allProductNamesOfSupplier = await query
      .distinct('supplier_id', 'name') // Specify all relevant columns or unique columns
      .groupBy('supplier_id', 'name')

    return JSON.parse(JSON.stringify(allProductNamesOfSupplier))
  }


  //:: GEt product details
  public static async getProductDetailsData(field, value) {
    const productDetails = await SupplierProduct.query()
      .where(field, value)
      .whereNull('deleted_at') // Exclude soft-deleted records
      .firstOrFail()
    return productDetails
  }
}

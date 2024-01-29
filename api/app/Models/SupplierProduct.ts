import { DateTime } from 'luxon'
import {
  BaseModel, column,
  belongsTo, BelongsTo
} from '@ioc:Adonis/Lucid/Orm'
import Supplier from './Supplier'
import { v4 as uuidv4 } from 'uuid';
import { ParsedQs } from 'qs';


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
  public quantity: number

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

  public static async createSupplierProducts(supplierData, requestData) {
    let products: any = []
    requestData.supplierProducts.forEach(element => {
      let singleData = {
        id: uuidv4(),
        ...element
      }
      products.push(singleData)
    });
    let result = await supplierData.related('supplierProducts').createMany(products);
    return result;
  }


  public static async getAllSupplierProductsForSpecificPeriod(queryParams: ParsedQs) {
    const perPage = queryParams.perPage ? parseInt(queryParams.perPage as string, 10) : 20;
    const page = queryParams.page ? parseInt(queryParams.page as string, 10) : 1;
    const order = queryParams.order ? queryParams.order.toString() : 'desc';
    const sort = queryParams.sort ? queryParams.sort.toString() : 'updated_at';
    const supplyChainReportingPeriodId = queryParams.supplyChainReportingPeriodId ? queryParams.supplyChainReportingPeriodId.toString() : '';

    let query = this.query().whereNull('deleted_at') // Exclude soft-deleted records;

    if (supplyChainReportingPeriodId) {
      query = query.whereHas('supplier', (data) => {
        data.where('supplyChainReportingPeriodId', supplyChainReportingPeriodId)
      })
    }

    if (sort == 'supplierName') {
      query = query.whereHas('supplier', (data) => {
        data.orderBy('name', order)
      })
    }
    else {
      query = query.orderBy(sort, order);
    }

    const allSupplierProductsData = await query
      .preload('supplier')
      .paginate(page, perPage);

    return allSupplierProductsData
  }


  public static async getProductsEmissionDataForSpecificPeriod(queryParams: ParsedQs) {
    const supplyChainReportingPeriodId = queryParams.supplyChainReportingPeriodId ? queryParams.supplyChainReportingPeriodId.toString() : '';

    let query = this.query().whereNull('deleted_at') // Exclude soft-deleted records;
    if (supplyChainReportingPeriodId) {
      query.whereHas('supplier', (query) => {
        query.where('supplyChainReportingPeriodId', supplyChainReportingPeriodId)
      })
    }

    const allSupplierProductsData = await query.preload('supplier');

    return JSON.parse(JSON.stringify(allSupplierProductsData));
  }
}

import { DateTime } from 'luxon'
import {
  BaseModel, column,
  belongsTo,
  BelongsTo,
  hasMany, HasMany
} from '@ioc:Adonis/Lucid/Orm'
import SupplyChainReportingPeriod from './SupplyChainReportingPeriod'
import SupplierProduct from './SupplierProduct'
import { ParsedQs } from 'qs';


export default class Supplier extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public supplyChainReportingPeriodId: string

  @column()
  public name: string

  @column()
  public email: string

  @column()
  public organizationRelationship: string

  @column()
  public address: string

  @column()
  public updatedBy: string

  @column.dateTime()
  public deletedAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime


  //::_____Relationships Start_____:://

  @belongsTo(() => SupplyChainReportingPeriod, {
    foreignKey: 'supplyChainReportingPeriodId',
  })
  public supplyChainReportingPeriod: BelongsTo<typeof SupplyChainReportingPeriod>



  @hasMany(() => SupplierProduct, {
    foreignKey: 'supplierId',
  })
  public supplierProducts: HasMany<typeof SupplierProduct>

  //::_____Relationships End_____:://



  public static async createSupplier(reportPeriodData, requestData,auth, trx: any = undefined) {

    const supplierData = await reportPeriodData.related('supplier').create({
      'id': requestData.id,
      'name': requestData.name,
      'email': requestData.email,
      'organizationRelationship': requestData.organizationRelationship,
      'address': requestData.address,
      'updatedBy':`${auth.user?.firstName} ${auth.user?.lastName}`
    }, { client: trx })
    return supplierData
  }


  public static async getSupplierDetails(field, value) {
    var supplierData = await Supplier.query()
      .where(field, value)
      .andWhereNull('deletedAt')
      .preload('supplyChainReportingPeriod', (query) => {
        query.select('id', 'reporting_period_from', 'reporting_period_to')
      })
      .preload('supplierProducts')
      .firstOrFail();

    return supplierData;
  }




  public static async updateSupplier(supplierData, requestData,auth) {
    supplierData.merge({
      'name': requestData.name,
      'email': requestData.email,
      'organizationRelationship': requestData.organizationRelationship,
      'address': requestData.address,
      'updatedBy':`${auth.user?.firstName} ${auth.user?.lastName}`
    }).save();

    return supplierData;
  }


  //:: Need to check 
  public static async getAllSuppliersForSpecificPeriod(queryParams: ParsedQs) {
    const perPage = queryParams.perPage ? parseInt(queryParams.perPage as string, 10) : 20;
    const page = queryParams.page ? parseInt(queryParams.page as string, 10) : 1;
    const order = queryParams.order ? queryParams.order.toString() : 'desc';
    const sort = queryParams.sort ? queryParams.sort.toString() : 'updated_at';
    const supplyChainReportingPeriodId = queryParams.supplyChainReportingPeriodId ? queryParams.supplyChainReportingPeriodId.toString() : '';

    let query = this.query().whereNull('deleted_at') // Exclude soft-deleted records;

    if (supplyChainReportingPeriodId) {
      query = query.where('supplyChainReportingPeriodId', supplyChainReportingPeriodId);
    }

    query = query.orderBy(sort, order);

    const allSuppliersData = await query.preload('supplierProducts')
      .paginate(page, perPage);

    return allSuppliersData
  }

}

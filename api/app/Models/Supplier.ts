import { DateTime } from 'luxon'
import {
  BaseModel, column,
  belongsTo,
  BelongsTo,
  hasMany, HasMany
} from '@ioc:Adonis/Lucid/Orm'
import SupplyChainReportingPeriod from './SupplyChainReportingPeriod'
import SupplierProduct from './SupplierProduct'

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



  public static async createSupplier(reportPeriodData, requestData, trx: any = undefined) {

    const supplierData = await reportPeriodData.related('supplier').create({
      'id': requestData.id,
      'name': requestData.name,
      'email': requestData.email,
      'organizationRelationship': requestData.organizationRelationship,
      'address': requestData.address,
    }, { client: trx })
    return supplierData
  }


  public static async getSupplierDetails(field, value) {
    const supplierData = await Supplier.query()
      .where(field, value)
      .andWhereNull('deletedAt')
      // .preload('supplyChainReportingPeriod')
      .preload('supplierProducts')
      .firstOrFail();
    return supplierData
  }

  public static async updateSupplier(supplierData, requestData) {
    supplierData.merge({
      'name': requestData.name,
      'email': requestData.email,
      'organizationRelationship': requestData.organizationRelationship,
      'address': requestData.address,
    }).save();

    return supplierData;
  }


  public static async getAllSuppliersForSpecificPeriod(request) {
    let page: number = request.qs().page ? request.qs().page : 1;
    let perPage: number | null = request.qs().per_page ? request.qs().per_page : null;
    let isPaginated: boolean = perPage ? true : false;
    let supplyChainReportingPeriodId = request.qs().supplyChainReportingPeriodId

    const allSuppliersData = await Supplier.query()
    .andWhereNull('deletedAt')


  }


}

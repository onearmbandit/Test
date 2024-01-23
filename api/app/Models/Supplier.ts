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
  public addressLine_1: string     //if used addressLine1 then error "the address_line1 is not a column" so used addressLine_1

  @column()
  public addressLine_2: string

  @column()
  public city: string

  @column()
  public state: string

  @column()
  public country: string

  @column()
  public zipCode: string

  @column.dateTime()
  public deletedAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime


  //::_____Relationships Start_____:://

  @belongsTo(() => SupplyChainReportingPeriod, {
    localKey: 'supplyChainReportingPeriodId',
  })
  public SupplyChainReportingPeriod: BelongsTo<typeof SupplyChainReportingPeriod>



  @hasMany(() => SupplierProduct, {
    foreignKey: 'supplierId',
  })
  public supplierProducts: HasMany<typeof SupplierProduct>

  //::_____Relationships End_____:://



  public static async createSupplier(reportPeriodData, requestData,trx) {

    const supplierData = await reportPeriodData.related('supplier').create({
      'id': requestData.id,
      'name': requestData.name,
      'email': requestData.email,
      'organizationRelationship': requestData.organizationRelationship,
      'addressLine_1': requestData.addressLine_1,
      'addressLine_2': requestData.addressLine_2 ? requestData.addressLine_2 : null,
      'city': requestData.city ? requestData.city : null,
      'state': requestData.state ? requestData.state : null,
      'country': requestData.country ? requestData.country : null,
      'zipCode': requestData.zipCode ? requestData.zipCode : null,
    },{ client: trx })
    return supplierData
  }

}

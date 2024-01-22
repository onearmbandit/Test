import { DateTime } from 'luxon'
import {
  BaseModel, column,
  belongsTo,
  BelongsTo,
  hasMany,HasMany
} from '@ioc:Adonis/Lucid/Orm'
import SupplierChainReportingPeriod from './SupplierChainReportingPeriod'
import SupplierProduct from './SupplierProduct'

export default class Supplier extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public supplierChainReportingPeriodId: string

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
  public zipcode: string

  @column.dateTime()
  public deletedAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime


  //::_____Relationships Start_____:://

  @belongsTo(() => SupplierChainReportingPeriod, {
    localKey: 'supplierChainReportingPeriodId',
  })
  public supplierChainReportingPeriod: BelongsTo<typeof SupplierChainReportingPeriod>



  @hasMany(() => SupplierProduct, {
    foreignKey: 'supplierId', 
  })
  public supplierProducts: HasMany<typeof SupplierProduct>

  //::_____Relationships End_____:://

}

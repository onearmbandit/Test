import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo,
  hasMany,HasMany
} from '@ioc:Adonis/Lucid/Orm'
import Organization from './Organization'
import Supplier from './Supplier'


export default class SupplierChainReportingPeriod extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public organizationId: string

  @column.date()
  public reportingPeriodFrom: DateTime

  @column.date()
  public reportingPeriodTo: DateTime

  @column.dateTime()
  public deletedAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime


  //::_____Relationships Start_____:://

  @belongsTo(() => Organization,{
    localKey: 'organizationId',
  })
  public organization: BelongsTo<typeof Organization>


  @hasMany(() => Supplier, {
    foreignKey: 'supplierChainReportingPeriodId', 
  })
  public supplier: HasMany<typeof Supplier>


    //::_____Relationships End_____:://

}

import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import FacilityEmission from './FacilityEmission'

export default class FacilityEqualityAttribute extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public facilityEmissionId: string

  @column()
  public equalityAttribute: boolean

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
}

import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import Organization from './Organization'

export default class Facility extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public addressLine1: string

  @column()
  public addressLine2: string

  @column()
  public city: string

  @column()
  public state: string

  @column()
  public country: string

  @column()
  public zip: string

  @column.dateTime()
  public deletedAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime


  @belongsTo(() => Organization,{
    localKey: 'organizations_id',
  })
  public organization: BelongsTo<typeof Organization>

  public static async createFacility(facilityDataArray) {
    const createdFacilities = [];

    for (const facilityData of facilityDataArray) {
      const result = await Facility.create(facilityData);
      const facility = await Facility.findOrFail(result.id);

      createdFacilities.push(facility);
    }

  return createdFacilities;
  }
}

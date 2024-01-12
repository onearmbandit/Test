import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  beforeSave,
  belongsTo,
  column,
} from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class WorkDetail extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number 

  @column()
  public company_name: string

  @column()
  public company_street_address: string

  @column()
  public floor: string

  @column()
  public city: string

  @column()
  public state: string

  @column()
  public zip_code: string


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime


  // Relationship
  @belongsTo(() => User, {
    localKey: 'user_id',
  })
  public user: BelongsTo<typeof User>



}

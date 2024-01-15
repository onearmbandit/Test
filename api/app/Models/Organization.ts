import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
} from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Organization extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number 

  @column()
  public companyName: string

  @column()
  public companyEmail: string

  @column()
  public selfPointOfContact: string

  @column()
  public companySize: string

  @column()
  public naicsCode: string

  @column()
  public targets: JSON

  @column()
  public addressLine_1: string

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


  // Relationship
  @belongsTo(() => User, {
    localKey: 'user_id',
  })
  public user: BelongsTo<typeof User>



}

import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeSave,
  HasOne,
  hasOne,
  column,
} from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import WorkDetail from './WorkDetail'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public first_name: string

  @column()
  public last_name: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column.dateTime()
  public emailVerifiedAt: DateTime
  
  @column()
  public emailVerifyToken: string

  @column()
  public userStatus: number

  @column()
  public remember_token: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime



  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  // Relationship
  @hasOne(() => WorkDetail,{
    foreignKey: 'user_id',
  })
  public workData: HasOne<typeof WorkDetail>
}

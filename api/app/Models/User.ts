import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeSave,
  HasOne,
  hasOne,
  column,
} from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import Organization from './Organization'
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'


export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public firstName: string

  @column()
  public lastName: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  @slugify({
    strategy: 'dbIncrement',
    fields: ['firstName', 'lastName'],
    allowUpdates: true,
  })
  public slug: string | null

  @column.dateTime()
  public emailVerifiedAt: DateTime

  @column()
  public emailVerifyToken: string

  @column()
  public userStatus: number

  @column()
  public rememberToken: string |null

  @column.dateTime()
  public rememberTokenExpires: DateTime | null

  @column()
  public loginType: string

  @column()
  public timezone: string

  @column()
  public registrationStep: string

  @column.dateTime()
  public deletedAt: DateTime

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
  @hasOne(() => Organization, {
    foreignKey: 'user_id',
  })
  public organization: HasOne<typeof Organization>
}

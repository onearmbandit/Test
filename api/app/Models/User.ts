import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeSave,
  column,
  manyToMany, ManyToMany
} from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import Organization from './Organization'
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'
import Role from './Role'
import { v4 as uuidv4 } from 'uuid';

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
  public rememberToken: string | null

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
  // @hasOne(() => Organization, {
  //   foreignKey: 'user_id',
  // })
  // public organization: HasOne<typeof Organization>

  //::_____Relationships Start_____:://

  @manyToMany(() => Role, {
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'role_id',
    pivotTable: 'user_roles',
    pivotTimestamps: true,
  })
  public roles: ManyToMany<typeof Role>

  //::_____Relationships End_____:://

  @manyToMany(() => Organization, {
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'organization_id',
    pivotTable: 'organization_users',
    pivotTimestamps: true,
  })
  public organizations: ManyToMany<typeof Organization>


  //:: Just with first() method
  public static async getUserDetailsWithFirst(field, value) {
    const user = await User.query().where(field, value)
      .preload('roles')
      .preload('organizations')
      .first();
    return user;
  }

  public static async getUserDetails(field, value) {
    const userData = await User.query().where(field, value)
      .preload('roles')
      .preload('organizations')
      .firstOrFail();

    return userData
  }

  public static async getUserDetailsWithPreloads(id) {
    const user = await User.query().where('id', id)
      .preload('roles')
      .preload('organizations').firstOrFail();

    return user

  }

  public static async createUserWithRole(userData, roleData) {
    const result = await User.create(userData)
    //:: Assign admin role to new user
    await result.related('roles').attach({
      [roleData.id]:{
      id: uuidv4(),
    }})

    const user = await User.getUserDetails('id', result.id)
    return user;
  }

}

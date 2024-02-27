import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeSave,
  column,
  manyToMany,
  ManyToMany,
  hasMany,
  HasMany,
} from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import Organization from './Organization'
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'
import Role from './Role'
import { v4 as uuidv4 } from 'uuid'
import ApiToken from './ApiToken'


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
  public socialLoginToken: string

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

  @hasMany(() => ApiToken, {
    onQuery: (query) => query.where('type', 'api'),
  })
  public api_token: HasMany<typeof ApiToken>


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


  @manyToMany(() => Organization, {
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'organization_id',
    pivotTable: 'organization_users',
    pivotTimestamps: true,
  })
  public organizations: ManyToMany<typeof Organization>

  //::_____Relationships End_____:://

  /**
 * Gets user details by the given field and value, preloading roles and organizations.
 * 
 * @returns The user object if found, null if not.
 */
  public static async getUserDetailsWithFirst(field, value) {
    const user = await User.query()
      .where(field, value)
      .andWhereNull('deletedAt')
      .preload('roles')
      .preload('organizations')
      .first()
    return user
  }

  /**
 * Gets user details by the given field and value, preloading roles and organizations.
 * @returns The user object if found, throws error if not.
 */
  public static async getUserDetails(field, value) {
    const userData = await User.query()
      .where(field, value)
      .andWhereNull('deletedAt')
      .preload('roles')
      .preload('organizations')
      .firstOrFail()

    return userData
  }

  /**
 * Gets user details by ID, preloading roles and organizations.
 * 
 * @param id - The ID of the user to get.
 * @returns The user object if found, throws error if not.
 */
  public static async getUserDetailsWithPreloads(id) {
    const user = await User.query()
      .where('id', id)
      .andWhereNull('deletedAt')
      .preload('roles')
      .preload('organizations')
      .firstOrFail()

    return user
  }

  /**
 * Gets user details by the given field and value, preloading roles and organizations. 
 * Also searches by social login token if provided.
 * 
 * @param field - The field to search by.
 * @param value - The value to search for.
 * @param token - Optional social login token to search by.
 * @returns The user object if found, null if not.
 */
  public static async getUserDetailsWithSocialToken(field, value, token) {
    const user = await User.query()
      .where(field, value)
      .orWhere('socialLoginToken', token)
      .andWhereNull('deletedAt')
      .preload('roles')
      .preload('organizations')
      .first()
    return user
  }

  /**
 * Creates a new user with the given user data and assigns them the provided role.
 * @returns The newly created user with role assigned.
 */
  public static async createUserWithRole(userData, roleData) {
    const result = await User.create(userData)
    //:: Assign admin role to new user
    await result.related('roles').attach({
      [roleData.id]: {
        id: uuidv4(),
      },
    })

    const user = await User.getUserDetails('id', result.id)
    return user
  }

  /**
 * Gets details of the currently logged in user, preloading roles and organizations.
 * 
 * @param authUser - The authenticated user object. 
 * @returns The user object for the authenticated user.
*/
  public static async getLoggedInUser(authUser) {
    const user = await User.query()
      .where('id', authUser.id)
      .andWhereNull('deletedAt')
      .preload('roles')
      .preload('organizations')
      .firstOrFail()
    return user
  }

  /**
 * Deletes the given user by setting their deletedAt timestamp 
 * and appending the current timestamp to their email.
 * 
 * @param user - The user to delete.
 */
  public static async deleteUser(user) {
    await ApiToken.expireApiToken(user)
    const userEmail = DateTime.now() + '_' + user.email
    await user.merge({ deletedAt: DateTime.now(), email: userEmail }).save()
    return
  }

  /**
 * Updates the given user with the provided request data.
 *
 * @param user - The user to update. 
 * @param requestData - The data to update on the user.
 * @returns The updated user details.
 */
  public static async updateUser(user, requestData) {
    await user.merge(requestData).save()
    const userDetails = await User.find(user.id)
    return userDetails
  }

  /**
 * Verifies a plain text password against the hashed password stored for this user.
 * @returns A Promise resolving to true if the password matches, false otherwise.
 */
  public async verifyPassword(plainPassword: string): Promise<boolean> {
    return Hash.verify(plainPassword, this.password)
  }
}

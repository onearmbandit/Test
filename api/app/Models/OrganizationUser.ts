import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from 'uuid'

export default class OrganizationUser extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @column()
  public organization_id: number

  @column()
  public role_id: number

  @column()
  public invited_by: number

  @column()
  public email: string

  @column()
  public firstName: string

  @column()
  public lastName: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  public static findByUserId(userId: number) {
    return this.query().where('user_id', userId).first()
  }

  public static async createInvite(organizationInvite: any) {
    // Generate a new UUID for the id field
    const id = uuidv4()

    // Merge the generated id with the organization invitation data
    const dataWithId = { ...organizationInvite, id }

    const result = await OrganizationUser.create(dataWithId)

    return result
  }


  public static async getOrganizationUserDetails(field, value) {
    var data = await OrganizationUser.query()
      .where(field, value)
      .first()

    return data
  }
}

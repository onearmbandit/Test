import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  //::_____Relationships Start_____:://

  @manyToMany(() => User, {
    localKey: 'id',
    pivotForeignKey: 'role_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'user_id',
    pivotTable: 'user_roles',
  })
  public users: ManyToMany<typeof User>

  //::_____Relationships End_____:://


  public static async getRoleByName(name) {
    const role: any = await Role.findBy('name',name)
    return role;
  }
}

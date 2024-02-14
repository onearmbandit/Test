import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import { UserRoles } from 'App/helpers/constants'

export default class OrganizationPolicy extends BasePolicy {
  public async view(user: User, organization) {
    // create array of ids
    let userIds = (await organization.users).map((user) => user.id)
    return userIds.includes(user.id)
  }

  public async update(user: User, organization) {
    // create array of ids
    let userIds = (await organization.users).map((user) => user.id)
    return userIds.includes(user.id)
  }

  public async create(user: User) {
    // create array of ids
    const userFound = await User.getUserDetails('id', user.id)

    return userFound.roles?.some((role: any) => role.name === UserRoles.SUPER_ADMIN)
  }

  public async index(user: User) {
    //:: Only super admin can access all organizations
    const userFound = await User.getUserDetails('id', user.id)
    return userFound?.roles?.some((role: any) => role.name === UserRoles.SUPER_ADMIN)
  }
}

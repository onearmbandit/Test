import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import OrganizationUser from 'App/Models/OrganizationUser'
import { UserRoles } from 'App/helpers/constants'

export default class OrganizationFacilityPolicy extends BasePolicy {

  public async view(user: OrganizationUser, OrganizationFacility) {
    // create array of ids
    let userIds = (await OrganizationFacility.users).map((user) => user.id)
    return userIds.includes(user.id)
  }

  public async update(user: User, OrganizationFacility) {
    // create array of ids
    let userIds = (await OrganizationFacility.users).map((user) => user.id)
    return userIds.includes(user.id)
  }

  public async create(user: User) {
    // create array of ids
    const userFound = await User.getUserDetails('id', user.id)

    return userFound.roles?.some((role: any) => role.name === UserRoles.SUPER_ADMIN)
  }
}

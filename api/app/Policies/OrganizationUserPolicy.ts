import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import { UserRoles } from 'App/helpers/constants'

export default class OrganizationUserPolicy extends BasePolicy {
  public async invite(user: User, invitedBy: User) {
    // create array of ids
    return invitedBy.roles?.some((role: any) => role.name === UserRoles.SUPER_ADMIN)
  }
}

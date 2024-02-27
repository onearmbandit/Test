import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import { UserRoles } from 'App/helpers/constants'

export default class OrganizationUserPolicy extends BasePolicy {
  /**
 * Checks if the given user has the SUPER_ADMIN role in their roles array.
 * 
 * @param user - The user to check
 * @returns True if the user has the SUPER_ADMIN role, false otherwise
 */
  public async invite(user: User) {
    // create array of ids
    const userFound = await User.getUserDetails('id', user.id)
    return userFound?.roles?.some((role: any) => role.name === UserRoles.SUPER_ADMIN)
  }
}

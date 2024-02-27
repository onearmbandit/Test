import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import { UserRoles } from 'App/helpers/constants'

export default class OrganizationPolicy extends BasePolicy {
  /**
 * Checks if the given user can view the given organization.
 * 
 * Checks if the user's ID is included in the array of user IDs belonging to the organization.
 * Returns true if the user's ID is found in the organization's users, false otherwise.
 */
  public async view(user: User, organization) {
    let userIds = (await organization.users).map((user) => user.id)
    return userIds.includes(user.id)
  }

  /**
 * Checks if the given user can update the given organization.
 * 
 * Checks if the user's ID is included in the array of user IDs belonging to the organization.
 * Returns true if the user's ID is found in the organization's users, false otherwise.
 */
  public async update(user: User, organization) {
    let userIds = (await organization.users).map((user) => user.id)
    return userIds.includes(user.id)
  }

  /**
 * Checks if the given user can create a new organization.
 * 
 * Gets the user details for the given user ID. 
 * Checks if the user's roles includes the 'SUPER_ADMIN' role.
 * Returns true if the user has the 'SUPER_ADMIN' role, false otherwise.
 */
  public async create(user: User) {
    const userFound = await User.getUserDetails('id', user.id)

    return userFound.roles?.some((role: any) => role.name === UserRoles.SUPER_ADMIN)
  }

  /**
 * Checks if the given user can access all organizations.
 * 
 * Gets the user details for the given user ID.
 * Checks if the user's roles includes the 'SUPER_ADMIN' role. 
 * Returns true if the user has the 'SUPER_ADMIN' role, false otherwise.
 */
  public async index(user: User) {
    //:: Only super admin can access all organizations
    const userFound = await User.getUserDetails('id', user.id)
    return userFound?.roles?.some((role: any) => role.name === UserRoles.SUPER_ADMIN)
  }
}

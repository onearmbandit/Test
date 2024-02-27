import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Organization from 'App/Models/Organization';

export default class OrganizationFacilityPolicy extends BasePolicy {
    /**
 * Checks if the user has view access to the given organization facility.
 * 
 * Gets the organization details and its related users. Checks if the 
 * given user's ID is included in the organization's user IDs.
 * 
 * @param user - The user to check access for
 * @param organizationFacility - The organization facility to check access to
 * @returns True if user has access, false otherwise
 */
    public async view(user: User, organizationFacility) {
        //:: Get organization details with his related users to check auth user included in it or not.
        let organizationData = await Organization.getOrganizationDetails('id', organizationFacility.organization_id)
        let userIds = (await organizationData.users).map((user) => user.id)
        return userIds.includes(user.id)
    }

    /**
 * Checks if the user has update access to the given organization facility.
 * 
 * Gets the organization details and its related users. Checks if the 
 * given user's ID is included in the organization's user IDs.
 */
    public async update(user: User, organizationFacility) {
        let organizationData = await Organization.getOrganizationDetails('id', organizationFacility.organization_id)
        let userIds = (await organizationData.users).map((user) => user.id)
        return userIds.includes(user.id)
    }

    /**
 * Checks if the user has delete access to the given organization facility.
 * 
 * Gets the organization details and its related users. Checks if the  
 * given user's ID is included in the organization's user IDs.
 */
    public async delete(user: User, organizationFacility) {
        let organizationData = await Organization.getOrganizationDetails('id', organizationFacility.organization_id)
        let userIds = (await organizationData.users).map((user) => user.id)
        return userIds.includes(user.id)
    }

   
}

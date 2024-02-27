import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Organization from 'App/Models/Organization';

export default class SupplyChainReportingPeriodPolicy extends BasePolicy {
    /**
 * Checks if the given user is authorized to update the report period data for the given organization.
 * 
 * @param user - The user attempting to update the report period data
 * @param reportPeriodData - The report period data being updated
 * @returns True if the user is authorized, false otherwise
 */
    public async update(user: User, reportPeriodData) {
        let organizationData = await Organization.getOrganizationDetails('id', reportPeriodData.organization_id)
        let userIds = (await organizationData.users).map((user) => user.id)
        return userIds.includes(user.id)
    }

    /**
 * Checks if the given user is authorized to view the report period data for the given organization.
 */
    public async show(user: User, reportPeriodData) {
        let organizationData = await Organization.getOrganizationDetails('id', reportPeriodData.organization_id)
        let userIds = (await organizationData.users).map((user) => user.id)
        return userIds.includes(user.id)
    }

    /**
 * Checks if the given user is authorized to delete the report period data for the given organization.
 */
    public async delete(user: User, reportPeriodData) {
        let organizationData = await Organization.getOrganizationDetails('id', reportPeriodData.organization_id)
        let userIds = (await organizationData.users).map((user) => user.id)
        return userIds.includes(user.id)
    }
}

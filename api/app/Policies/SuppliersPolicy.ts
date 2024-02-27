import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Organization from 'App/Models/Organization'


export default class SuppliersPolicy extends BasePolicy {
    /**
 * Checks if the user is authorized to create a report period data for the given organization.
 * Gets the organization details and checks if the user's ID is included in the organization's user IDs.
*/
    public async create(user: User, reportPeriodData) {
        let organizationData = await Organization.getOrganizationDetails('id', reportPeriodData.organization_id)
        let userIds = (await organizationData.users).map((user) => user.id)
        return userIds.includes(user.id)
    }

    /**
 * Checks if the user is authorized to view a supplier's data. 
 * Gets the supplier's organization ID, then gets the organization details and checks if 
 * the user's ID is included in the organization's user IDs.
*/
    public async show(user: User, supplierData) {
        let organization_id = await supplierData.supplyChainReportingPeriod?.organization_id
        let organizationData = await Organization.getOrganizationDetails('id', organization_id)
        let userIds = (await organizationData.users).map((user) => user.id)
        return userIds.includes(user.id)
    }

    /**
 * Checks if the user is authorized to update a supplier's data.
 * Gets the supplier's organization ID, then gets the organization details and checks if 
 * the user's ID is included in the organization's user IDs.
*/
    public async update(user: User, supplierData) {
        let organization_id = await supplierData.supplyChainReportingPeriod?.organization_id
        let organizationData = await Organization.getOrganizationDetails('id', organization_id)
        let userIds = (await organizationData.users).map((user) => user.id)
        return userIds.includes(user.id)
    }

}

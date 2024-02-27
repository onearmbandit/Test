import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Supplier from 'App/Models/Supplier'
import Organization from 'App/Models/Organization'


export default class SupplierProductsPolicy extends BasePolicy {
    /**
 * Checks if the user has permission to delete the product details for the given supplier.
 * 
 * Gets the supplier details for the given supplier ID. 
 * Gets the organization ID from the supplier's supply chain reporting period.
 * Gets the organization details for the organization ID.
 * Gets the list of user IDs for the organization.
 * Checks if the list of organization user IDs includes the given user's ID.
 * 
 * @param user - The user deleting the product details
 * @param productDetailsData - The product details data with the supplier ID
 * @returns True if user ID is in the organization's user IDs, false otherwise
*/
    public async delete(user: User, productDetailsData) {
        var supplierData = (await Supplier.getSupplierDetails('id', productDetailsData.supplier_id)).toJSON()
        let organization_id = await supplierData.supplyChainReportingPeriod?.organization_id
        let organizationData = await Organization.getOrganizationDetails('id', organization_id)
        let userIds = (await organizationData.users).map((user) => user.id)
        return userIds.includes(user.id)
    }
}

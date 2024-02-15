import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Supplier from 'App/Models/Supplier'
import Organization from 'App/Models/Organization'


export default class SupplierProductsPolicy extends BasePolicy {
    public async delete(user: User, productDetailsData) {
        var supplierData = (await Supplier.getSupplierDetails('id',productDetailsData.supplier_id)).toJSON()
        let organization_id= await supplierData.supplyChainReportingPeriod?.organization_id
        let organizationData = await Organization.getOrganizationDetails('id', organization_id)
        let userIds = (await organizationData.users).map((user) => user.id)
        return userIds.includes(user.id)
    }
}

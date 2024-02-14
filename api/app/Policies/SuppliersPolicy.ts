import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Organization from 'App/Models/Organization'


export default class SuppliersPolicy extends BasePolicy {
    public async create(user: User, reportPeriodData) {
        let organizationData = await Organization.getOrganizationDetails('id', reportPeriodData.organization_id)
        let userIds = (await organizationData.users).map((user) => user.id)
        return userIds.includes(user.id)
    }

    public async show(user: User, supplierData) {
        let organization_id= await supplierData.supplyChainReportingPeriod?.organization_id
        let organizationData = await Organization.getOrganizationDetails('id', organization_id)
        let userIds = (await organizationData.users).map((user) => user.id)
        return userIds.includes(user.id)
    }

    public async update(user: User, supplierData) {
        let organization_id= await supplierData.supplyChainReportingPeriod?.organization_id
        let organizationData = await Organization.getOrganizationDetails('id', organization_id)
        let userIds = (await organizationData.users).map((user) => user.id)
        return userIds.includes(user.id)
    }

}

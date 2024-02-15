import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Organization from 'App/Models/Organization';

export default class SupplyChainReportingPeriodPolicy extends BasePolicy {
    public async update(user: User, reportPeriodData) {
        let organizationData = await Organization.getOrganizationDetails('id', reportPeriodData.organization_id)
        let userIds = (await organizationData.users).map((user) => user.id)
        return userIds.includes(user.id)
    }

    public async show(user: User, reportPeriodData) {
        let organizationData = await Organization.getOrganizationDetails('id', reportPeriodData.organization_id)
        let userIds = (await organizationData.users).map((user) => user.id)
        return userIds.includes(user.id)
    }

    public async delete(user: User, reportPeriodData) {
        let organizationData = await Organization.getOrganizationDetails('id', reportPeriodData.organization_id)
        let userIds = (await organizationData.users).map((user) => user.id)
        return userIds.includes(user.id)
    }
}

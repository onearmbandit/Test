import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Organization from 'App/Models/Organization';

export default class OrganizationFacilityPolicy extends BasePolicy {
    public async view(user: User, organizationFacility) {
        //:: Get organization details with his related users to check auth user included in it or not.
        let organizationData = await Organization.getOrganizationDetails('id', organizationFacility.organization_id)
        let userIds = (await organizationData.users).map((user) => user.id)
        return userIds.includes(user.id)
    }

    public async update(user: User, organizationFacility) {
        let organizationData = await Organization.getOrganizationDetails('id', organizationFacility.organization_id)
        let userIds = (await organizationData.users).map((user) => user.id)
        return userIds.includes(user.id)
    }

    public async delete(user: User, organizationFacility) {
        let organizationData = await Organization.getOrganizationDetails('id', organizationFacility.organization_id)
        let userIds = (await organizationData.users).map((user) => user.id)
        return userIds.includes(user.id)
    }

    public async create(user: User) {
    }
}

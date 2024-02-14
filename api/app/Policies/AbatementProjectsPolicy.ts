import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Organization from 'App/Models/Organization'

export default class AbatementProjectsPolicy extends BasePolicy {
    public async show(user: User, projectData) {
        let organizationData = await Organization.getOrganizationDetails('id', projectData.organization_id)
        let userIds = (await organizationData.users).map((user) => user.id)
        return userIds.includes(user.id)
    }

    public async update(user: User, projectData) {
        let organizationData = await Organization.getOrganizationDetails('id', projectData.organization_id)
        let userIds = (await organizationData.users).map((user) => user.id)
        return userIds.includes(user.id)
    }

    public async delete(user: User, projectData) {
        let organizationData = await Organization.getOrganizationDetails('id', projectData.organization_id)
        let userIds = (await organizationData.users).map((user) => user.id)
        return userIds.includes(user.id)
    }
}

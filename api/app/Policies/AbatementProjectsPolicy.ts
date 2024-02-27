import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Organization from 'App/Models/Organization'

export default class AbatementProjectsPolicy extends BasePolicy {
    /**
 * Checks if the given user has permission to view the given abatement project.
 * 
 * It does this by getting the organization for the project, getting the user IDs for that organization,
 * and checking if the given user's ID is in that list.
 * 
 * @param user - The user attempting to view the project
 * @param projectData - The data for the abatement project
 * @returns True if the user has permission, false otherwise
 */
    public async show(user: User, projectData) {
        let organizationData = await Organization.getOrganizationDetails('id', projectData.organization_id)
        let userIds = (await organizationData.users).map((user) => user.id)
        return userIds.includes(user.id)
    }

    /**
 * Checks if the given user has permission to update the given abatement project.
 * 
 * It does this by getting the organization for the project, getting the user IDs for that organization,
 * and checking if the given user's ID is in that list.
 */
    public async update(user: User, projectData) {
        let organizationData = await Organization.getOrganizationDetails('id', projectData.organization_id)
        let userIds = (await organizationData.users).map((user) => user.id)
        return userIds.includes(user.id)
    }

    /**
 * Checks if the given user has permission to delete the given abatement project.
 * 
 * It does this by getting the organization for the project, getting the user IDs for that organization,
 * and checking if the given user's ID is in that list.
 */
    public async delete(user: User, projectData) {
        let organizationData = await Organization.getOrganizationDetails('id', projectData.organization_id)
        let userIds = (await organizationData.users).map((user) => user.id)
        return userIds.includes(user.id)
    }
}

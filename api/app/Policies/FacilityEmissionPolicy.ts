import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import OrganizationFacility from 'App/Models/OrganizationFacility';
import User from 'App/Models/User'



export default class FacilityEmissionPolicy extends BasePolicy {
    /**
 * Checks if the user has access to view the facility emission data.
 * 
 * It gets the user details and facility details from the DB.
 * Then it checks if the user's organizations include the organization ID of the facility.
 * If so, it returns true to allow access.
*/
    public async view(user: User, facilityEmissionData) {
        const userFound = await (await User.getUserDetails('id', user.id)).toJSON()
        let facilityData = await OrganizationFacility.getOrganizationFacilityData(
            'id', facilityEmissionData?.toJSON().organization_facility_id
        )

        let organizationIds = (await userFound.organizations).map((item) => item.id)
        return organizationIds.includes(facilityData.organization_id)
    }

    /**
 * Checks if the user has access to update the facility emission data.
 * 
 * It gets the user details and facility details from the DB. 
 * Then it checks if the user's organizations include the organization ID of the facility.
 * If so, it returns true to allow updating the data.
*/
    public async update(user: User, facilityEmissionData) {
        const userFound = await (await User.getUserDetails('id', user.id)).toJSON()
        let facilityData = await OrganizationFacility.getOrganizationFacilityData(
            'id', facilityEmissionData?.toJSON().organization_facility_id
        )

        let organizationIds = (await userFound.organizations).map((item) => item.id)
        return organizationIds.includes(facilityData.organization_id)
    }

    /**
 * Checks if the user has permission to delete the given facility emission data.
 * 
 * Gets the user details and facility details from the database.
 * Checks if the user's organizations include the organization ID of the facility.
 * If so, returns true to allow deleting the data.
*/
    public async delete(user: User, facilityEmissionData) {
        const userFound = await (await User.getUserDetails('id', user.id)).toJSON()
        let facilityData = await OrganizationFacility.getOrganizationFacilityData(
            'id', facilityEmissionData?.toJSON().organization_facility_id
        )

        let organizationIds = (await userFound.organizations).map((item) => item.id)
        return organizationIds.includes(facilityData.organization_id)
    }
}

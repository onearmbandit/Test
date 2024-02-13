import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import OrganizationFacility from 'App/Models/OrganizationFacility';
import User from 'App/Models/User'



export default class FacilityEmissionPolicy extends BasePolicy {
    public async view(user: User, facilityEmissionData) {
        const userFound = await (await User.getUserDetails('id', user.id)).toJSON()
        let facilityData = await OrganizationFacility.getOrganizationFacilityData(
            'id', facilityEmissionData?.toJSON().organization_facility_id
        )

        let organizationIds = (await userFound.organizations).map((item) => item.id)
        return organizationIds.includes(facilityData.organization_id)
    }

    public async update(user: User, facilityEmissionData) {
        const userFound = await (await User.getUserDetails('id', user.id)).toJSON()
        let facilityData = await OrganizationFacility.getOrganizationFacilityData(
            'id', facilityEmissionData?.toJSON().organization_facility_id
        )

        let organizationIds = (await userFound.organizations).map((item) => item.id)
        return organizationIds.includes(facilityData.organization_id)
    }

    public async delete(user: User, facilityEmissionData) {
        const userFound = await (await User.getUserDetails('id', user.id)).toJSON()
        let facilityData = await OrganizationFacility.getOrganizationFacilityData(
            'id', facilityEmissionData?.toJSON().organization_facility_id
        )

        let organizationIds = (await userFound.organizations).map((item) => item.id)
        return organizationIds.includes(facilityData.organization_id)
    }
}

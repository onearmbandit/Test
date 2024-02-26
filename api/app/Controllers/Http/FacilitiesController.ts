import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { apiResponse } from 'App/helpers/response'
import Config from '@ioc:Adonis/Core/Config'
import CreateFacilityValidator from 'App/Validators/Facility/CreateFacilityValidator'
import OrganizationFacility from 'App/Models/OrganizationFacility'
import UpdateFacilityValidator from 'App/Validators/Facility/UpdateFacilityValidator'
import { DateTime } from 'luxon'
import User from 'App/Models/User'

export default class FacilitiesController {

  /**
 * Handles GET request to retrieve facilities. 
 * 
 * Checks if organization ID in query params matches current user's organizations.
 * Calls getAllFacilities on OrganizationFacility model to retrieve facilities.
 * Handles pagination if per_page is set in query params.
 * Returns API response with facilities data or error.
*/
  public async index({ response, request, auth }: HttpContextContract) {
    try {
      const queryParams = request.qs();

      //:: Check organization id is same for auth user or not
      const userFound = await User.getUserDetails('id', auth.user?.id)
      let organizationIds = (await userFound.organizations).map((item) => item.id)
      if (queryParams.organization_id && !organizationIds.includes(queryParams.organization_id)) {
        return apiResponse(
          response,
          false,
          403,
          {},
          "The provided organization ID does not belongs to you."
        )
      }

      const facilities = await OrganizationFacility.getAllFacilities(queryParams);

      const isPaginated = request.input('per_page') && request.input('per_page') !== 'all'

      return apiResponse(response, true, 200, facilities, Config.get('responsemessage.ORGANIZATION_FACILITY_RESPONSE.dataFetchSuccess'), isPaginated);

    } catch (error) {
      return apiResponse(
        response,
        false,
        400,
        {},
        error.messages ? error.messages : error.message
      )
    }
  }

  /**
 * Handles POST request to create a new facility. 
 * 
 * Validates request data against CreateFacilityValidator.
 * Checks if organization ID matches current user's organizations. 
 * Checks if facility name already exists for the organization.
 * Calls createFacility on OrganizationFacility model to create new facility.
 * Returns API response with new facility data or error.
*/
  public async store({ request, response, auth }: HttpContextContract) {
    try {
      let requestData = request.all()

      // validate facility details
      await request.validate(CreateFacilityValidator)


      //:: Check organization id is same for auth user or not
      const userFound = await User.getUserDetails('id', auth.user?.id)
      let organizationIds = (await userFound.organizations).map((item) => item.id)
      if (requestData.organization_id && !organizationIds.includes(requestData.organization_id)) {
        return apiResponse(
          response,
          false,
          403,
          {},
          "The provided organization ID does not belongs to you."
        )
      }

      //:: check if facility name already exists for same organization
      if (requestData.organization_id) {
        const existingRecord = await OrganizationFacility.query()
          .where('name', requestData.name)
          .where('organization_id', requestData.organization_id)
          .first();

        if (existingRecord) {
          return apiResponse(
            response,
            false,
            422,
            {
              errors: [
                {
                  field: 'name',
                  message: Config.get('responsemessage.ORGANIZATION_FACILITY_RESPONSE.facilityAlreadyExists'),
                },
              ],
            },
            Config.get('responsemessage.COMMON_RESPONSE.validation_failed')
          )
        }

      }

      // create facility
      const result = await OrganizationFacility.createFacility(requestData, organizationIds[0])

      return apiResponse(response, true, 200, result, 'Data saved successfully')
    } catch (error) {
      if (error.status === 422) {
        return apiResponse(
          response,
          false,
          error.status,
          error.messages,
          Config.get('responsemessage.COMMON_RESPONSE.validationFailed')
        )
      } else {
        return apiResponse(
          response,
          false,
          400,
          {},
          error.messages ? error.messages : error.message
        )
      }
    }
  }

  /**
 * Gets an organization facility by ID.
 * 
 * Authorizes the user can view the facility via the OrganizationFacilityPolicy.
 * 
 * Returns the facility data on success.
 * Handles errors and returns a formatted API response.
*/
  public async show({ response, params, bouncer }: HttpContextContract) {
    try {
      const organizationFacility = await OrganizationFacility.getOrganizationFacilityData('id', params.id)

      //:: Authorization (auth user can access their organization-facility only)
      await bouncer.with('OrganizationFacilityPolicy').authorize('view', organizationFacility)

      return apiResponse(response, true, 200, organizationFacility, Config.get('responsemessage.COMMON_RESPONSE.getRequestSuccess'))
    }
    catch (error) {
      console.log("err>>", error)
      return apiResponse(response, false, error.status, { "errors": error.message });

    }
  }

  /**
 * Updates an organization facility. 
 * 
 * Validates the request data. Checks if the updated facility name already exists for the organization.
 * Authorizes the user can update the facility via the OrganizationFacilityPolicy.
 * Updates the facility data.
 * Handles errors and returns an API response.
*/
  public async update({ request, response, bouncer }: HttpContextContract) {
    try {

      let requestData = request.all()

      const organizationFacilityData = await OrganizationFacility.getOrganizationFacilityData('id', request.param('id'))

      //:: Authorization (auth user can update their organization's facility only)
      await bouncer.with('OrganizationFacilityPolicy').authorize('update', organizationFacilityData)

      const payload = await request.validate(UpdateFacilityValidator);

      //:: check if facility name already exists for same organization
      console.log("organizationFacilityData.organization_id >>", organizationFacilityData.organization_id)
      if (organizationFacilityData.organization_id) {
        const existingRecord = await OrganizationFacility.query()
          .where('name', requestData.name)
          .where('organization_id', organizationFacilityData.organization_id)
          .whereNot('id', request.param('id')) // Exclude the current facility being edited
          .first();

        if (existingRecord) {

          return apiResponse(
            response,
            false,
            422,
            {
              errors: [
                {
                  field: 'name',
                  message: Config.get('responsemessage.ORGANIZATION_FACILITY_RESPONSE.facilityAlreadyExists'),
                },
              ],
            },
            Config.get('responsemessage.COMMON_RESPONSE.validation_failed')
          )
        }
      }

      const updateFacility = await OrganizationFacility.updateOrganizationFacility(organizationFacilityData, payload)

      return apiResponse(response, true, 200, updateFacility,
        Config.get('responsemessage.ORGANIZATION_FACILITY_RESPONSE.updateFacilitySuccess'))
    } catch (error) {

      if (error.status === 422) {
        return apiResponse(response, false, error.status, error.messages, Config.get('responsemessage.COMMON_RESPONSE.validationFailed'))
      }
      else {
        return apiResponse(response, false, 400, {}, error.messages ? error.messages : error.message)
      }
    }
  }

  /**
 * Destroys an organization facility record by ID. 
 * Authorizes the authenticated user can only delete facilities belonging to their organization.
 * Sets the deleted_at timestamp on the facility record.
*/
  public async destroy({ request, response, bouncer }: HttpContextContract) {
    try {
      const organizationFacilityData = await OrganizationFacility.getOrganizationFacilityData('id', request.param('id'))

      //:: Authorization (auth user can delete only their organization's facility not other)
      await bouncer.with('OrganizationFacilityPolicy').authorize('delete', organizationFacilityData)

      if (organizationFacilityData) {
        organizationFacilityData.deleted_at = DateTime.local()
        await organizationFacilityData.save()

        return apiResponse(response, true, 200, {}, Config.get('responsemessage.ORGANIZATION_FACILITY_RESPONSE.deleteFacilitySuccess'))
      } else {
        return apiResponse(response, false, 401, {}, Config.get('responsemessage.ORGANIZATION_FACILITY_RESPONSE.facilityNotFound'))
      }

    } catch (error) {
      return apiResponse(response, false, 404, {}, error.message)
    }
  }
}

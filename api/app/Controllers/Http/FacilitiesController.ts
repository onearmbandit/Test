import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { apiResponse } from 'App/helpers/response'
import Config from '@ioc:Adonis/Core/Config'
import CreateFacilityValidator from 'App/Validators/Facility/CreateFacilityValidator'
import OrganizationFacility from 'App/Models/OrganizationFacility'
import UpdateFacilityValidator from 'App/Validators/Facility/UpdateFacilityValidator'
import { DateTime } from 'luxon'
import User from 'App/Models/User'

export default class FacilitiesController {

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
            {},
            Config.get('responsemessage.ORGANIZATION_FACILITY_RESPONSE.facilityAlreadyExists')
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
            {},
            Config.get('responsemessage.ORGANIZATION_FACILITY_RESPONSE.facilityAlreadyExists')
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

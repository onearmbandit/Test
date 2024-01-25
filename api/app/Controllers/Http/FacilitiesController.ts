import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { apiResponse } from 'App/helpers/response'
import Config from '@ioc:Adonis/Core/Config'
import CreateFacilityValidator from 'App/Validators/Facility/CreateFacilityValidator'
import OrganizationFacility from 'App/Models/OrganizationFacility'
import UpdateFacilityValidator from 'App/Validators/Facility/UpdateFacilityValidator'
import { DateTime } from 'luxon'

export default class FacilitiesController {

  public async index({response, request}: HttpContextContract) {
    try {
      const queryParams = request.qs();

      const facilities = await OrganizationFacility.getAllFacilities(queryParams);

      const isPaginated = !request.input('per_page') || request.input('per_page') !== 'all';

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

  public async store({ request, response }: HttpContextContract) {
    try {
      let requestData = request.all()

      // validate facility details
      await request.validate(CreateFacilityValidator)

      // create facility
      const result = await OrganizationFacility.createFacility(requestData)

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

  public async show({response, params}: HttpContextContract) {
    try {
      const organizationFacility = await OrganizationFacility.getOrganizationFacilityData('id', params.id)

      return apiResponse(response, true, 200, organizationFacility, Config.get('responsemessage.COMMON_RESPONSE.getRequestSuccess'))
    }
    catch (error) {
      console.log("err>>", error)
      return apiResponse(response, false, error.status, { "errors": error.message });

    }
  }

  public async update({request, response}: HttpContextContract) {
    try {

      const organizationFacilityData = await OrganizationFacility.getOrganizationFacilityData('id', request.param('id'))

      const payload = await request.validate(UpdateFacilityValidator);

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

  public async destroy({request, response}: HttpContextContract) {
    try {
      const organizationFacilityData = await OrganizationFacility.getOrganizationFacilityData('id', request.param('id'))

      if (organizationFacilityData) {
        organizationFacilityData.deletedAt = DateTime.local()
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

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { apiResponse } from 'App/helpers/response'
import Config from '@ioc:Adonis/Core/Config';
import ReportingPeriodValidator from 'App/Validators/FacilityEmission/ReportingPeriodValidator';
import FacilityEmission from 'App/Models/FacilityEmission';
import UpdateFacilityEmissionValidator from 'App/Validators/FacilityEmission/UpdateFacilityEmissionValidator';
import { DateTime } from 'luxon';

export default class FacilityEmissionsController {

  public async index({ response, request }: HttpContextContract) {
    try {
      const queryParams = request.qs();

      const facilityEmissions = await FacilityEmission.getAllFacilityEmissions(queryParams);

      const isPaginated = !request.input('per_page') || request.input('per_page') !== 'all';

      return apiResponse(response, true, 200, facilityEmissions, Config.get('responsemessage.ORGANIZATION_FACILITY_RESPONSE.dataFetchSuccess'), isPaginated);

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
      await request.validate(ReportingPeriodValidator)

      const reportingPeriodData = await FacilityEmission.createReportingPeriod(requestData)

      // Format dates before sending the response
      // reportingPeriodData.reportingPeriodFrom = reportingPeriodData.reportingPeriodFrom.toFormat('yyyy-MM');
      // reportingPeriodData.reportingPeriodTo = reportingPeriodData.reportingPeriodTo.toFormat('yyyy-MM');

      return apiResponse(response, true, 201, reportingPeriodData,
        Config.get('responsemessage.ORGANIZATION_FACILITY_RESPONSE.createFacilityReportPeriodSuccess'))

    } catch (error) {
      console.log("error", error)
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

  public async show({ response, params }: HttpContextContract) {
    try {
      const FacilityEmissionData = await FacilityEmission.getFacilityEmissionData('id', params.id)

      return apiResponse(response, true, 200, FacilityEmissionData, Config.get('responsemessage.COMMON_RESPONSE.getRequestSuccess'))
    }
    catch (error) {
      console.log("err>>", error)
      return apiResponse(response, false, error.status, { "errors": error.message });

    }
  }

  public async update({ request, response }: HttpContextContract) {
    try {

      const FacilityEmissionData = await FacilityEmission.getFacilityEmissionData('id', request.param('id'))

      const payload = await request.validate(UpdateFacilityEmissionValidator);

      const updateFacilityEmission = await FacilityEmission.updateFacilityEmissionData(FacilityEmissionData, payload)

      return apiResponse(response, true, 200, updateFacilityEmission,
        Config.get('responsemessage.ORGANIZATION_FACILITY_RESPONSE.updateFacilityEmissionSuccess'))
    } catch (error) {

      if (error.status === 422) {
        return apiResponse(response, false, error.status, error.messages, Config.get('responsemessage.COMMON_RESPONSE.validationFailed'))
      }
      else {
        return apiResponse(response, false, 400, {}, error.messages ? error.messages : error.message)
      }
    }
  }

  public async destroy({ request, response }: HttpContextContract) {
    try {
      const FacilityEmissionData = await FacilityEmission.getFacilityEmissionData('id', request.param('id'))

      if (FacilityEmissionData) {
        FacilityEmissionData.deletedAt = DateTime.local()
        await FacilityEmissionData.save()

        return apiResponse(response, true, 200, {}, Config.get('responsemessage.ORGANIZATION_FACILITY_RESPONSE.deleteFacilityEmissionSuccess'))
      } else {
        return apiResponse(response, false, 401, {}, Config.get('responsemessage.ORGANIZATION_FACILITY_RESPONSE.facilityNotFound'))
      }

    } catch (error) {
      return apiResponse(response, false, 404, {}, error.message)
    }
  }

  public async getDashboardData({ response, request }: HttpContextContract) {
    try {

      const queryParams = request.qs();

      const facilityDashboardData = await FacilityEmission.getFacilitiesDashboardData(queryParams);

      return apiResponse(response, true, 200, facilityDashboardData, Config.get('responsemessage.ORGANIZATION_FACILITY_RESPONSE.dashboardCalculationFetchSuccess'));

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
}

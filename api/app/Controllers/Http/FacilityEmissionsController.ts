import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { apiResponse } from 'App/helpers/response'
import Config from '@ioc:Adonis/Core/Config';
import ReportingPeriodValidator from 'App/Validators/FacilityEmission/ReportingPeriodValidator';
import FacilityEmission from 'App/Models/FacilityEmission';
import UpdateFacilityEmissionValidator from 'App/Validators/FacilityEmission/UpdateFacilityEmissionValidator';
import { DateTime } from 'luxon';
import User from 'App/Models/User';
// import moment from 'moment';
import Database from '@ioc:Adonis/Lucid/Database';

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

      // Convert year-month to yyyy-mm-dd for database storage
      const reportingPeriodFrom = DateTime.fromFormat(requestData.reportingPeriodFrom, 'yyyy-MM').toISODate();
      const reportingPeriodTo = DateTime.fromFormat(requestData.reportingPeriodTo, 'yyyy-MM').toISODate();

      if (!reportingPeriodFrom || !reportingPeriodTo) {
        return apiResponse(
          response,
          false,
          422,
          {
            errors: [
              {
                field: 'reportingPeriodFrom',
                message: Config.get('responsemessage.ORGANIZATION_FACILITY_RESPONSE.facilityReportingPeriodInvalidFormat'),
              },
            ],
          },
          Config.get('responsemessage.COMMON_RESPONSE.validation_failed')
        )
      }

      // Check for date overlap using raw SQL expressions
      const overlappingPeriods = await Database.query()
        .from('facility_emissions')
        .where('organization_facility_id', requestData.organizationFacilityId)
        .where(function (query) {
          query
            .whereRaw('( ? BETWEEN reporting_period_from AND reporting_period_to )', [
              reportingPeriodFrom,
            ])
            .orWhereRaw('( ? BETWEEN reporting_period_from AND reporting_period_to )', [
              reportingPeriodTo,
            ]);
        })
        .first();

      if (overlappingPeriods) {
        return apiResponse(
          response,
          false,
          422,
          {
            errors: [
              {
                field: 'reportingPeriodFrom',
                message: Config.get('responsemessage.ORGANIZATION_FACILITY_RESPONSE.facilityReportingPeriodOverlaps'),
              },
            ],
          },
          Config.get('responsemessage.COMMON_RESPONSE.validation_failed')
        )
      }

      const reportingPeriodData = await FacilityEmission.createReportingPeriod(requestData)

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

  public async show({ response, params, bouncer }: HttpContextContract) {
    try {
      const FacilityEmissionData = await FacilityEmission.getFacilityEmissionData('id', params.id)

      //:: Authorization (auth user can access their facility's emissions data only)
      await bouncer.with('FacilityEmissionPolicy').authorize('view', FacilityEmissionData)

      return apiResponse(response, true, 200, FacilityEmissionData, Config.get('responsemessage.COMMON_RESPONSE.getRequestSuccess'))
    }
    catch (error) {
      console.log("err>>", error)
      return apiResponse(response, false, error.status, { "errors": error.message });

    }
  }

  public async update({ request, response, bouncer }: HttpContextContract) {
    try {

      const FacilityEmissionData = await FacilityEmission.getFacilityEmissionData('id', request.param('id'))

      //:: Authorization (auth user can update their facility's emissions data only)
      await bouncer.with('FacilityEmissionPolicy').authorize('update', FacilityEmissionData)

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

  public async destroy({ request, response, bouncer }: HttpContextContract) {
    try {
      const FacilityEmissionData = await FacilityEmission.getFacilityEmissionData('id', request.param('id'))

      //:: Authorization (auth user can update their facility's emissions data only)
      await bouncer.with('FacilityEmissionPolicy').authorize('delete', FacilityEmissionData)

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

  public async getDashboardData({ response, request, auth }: HttpContextContract) {
    try {

      const queryParams = request.qs();
      //:: Check organization id is same for auth user or not
      const userFound = await User.getUserDetails('id', auth.user?.id)
      let organizationIds = (await userFound.organizations).map((item) => item.id)

      const facilityDashboardData = await FacilityEmission.getFacilitiesDashboardData(queryParams, organizationIds[0]);

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

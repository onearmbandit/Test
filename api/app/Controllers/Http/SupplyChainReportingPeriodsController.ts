import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { apiResponse } from 'App/helpers/response'
import Config from '@ioc:Adonis/Core/Config';
import SupplyChainReportingPeriodValidator from 'App/Validators/Supplier/SupplyChainReportingPeriodValidator';
import SupplyChainReportingPeriod from 'App/Models/SupplyChainReportingPeriod';
import User from 'App/Models/User';
import { DateTime } from 'luxon';
import Database from '@ioc:Adonis/Lucid/Database';



export default class SupplyChainReportingPeriodsController {
  public async index({ request, response, auth }: HttpContextContract) {
    try {

      const queryParams = request.qs();

      //:: Check organization id is same for auth user or not
      const userFound = await User.getUserDetails('id', auth.user?.id)
      let organizationIds = (await userFound.organizations).map((item) => item.id)
      if (queryParams.organizationId && !organizationIds.includes(queryParams.organizationId)) {
        return apiResponse(
          response,
          false,
          403,
          {},
          "The provided organization ID does not belongs to you."
        )
      }

      const reportingPeriods = await SupplyChainReportingPeriod.getAllReportingPeriod(queryParams);

      const isPaginated = request.input('per_page') && request.input('per_page') !== 'all';

      return apiResponse(response, true, 200, reportingPeriods, Config.get('responsemessage.COMMON_RESPONSE.getRequestSuccess'), isPaginated);


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

  public async store({ request, response, auth }: HttpContextContract) {
    try {
      let requestData = request.all()


      //:: Check organization id is same for auth user or not
      const userFound = await User.getUserDetails('id', auth.user?.id)
      let organizationIds = (await userFound.organizations).map((item) => item.id)
      if (requestData.organizationId && !organizationIds.includes(requestData.organizationId)) {
        return apiResponse(
          response,
          false,
          403,
          {},
          "The provided organization ID does not belongs to you."
        )
      }

      // validate facility details
      await request.validate(SupplyChainReportingPeriodValidator)

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
        .from('supply_chain_reporting_periods')
        .where('organization_id', requestData.organizationId ? requestData.organizationId : organizationIds[0])
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


      const reportPeriodData = await SupplyChainReportingPeriod.createReportPeriod(requestData, organizationIds[0])




      return apiResponse(response, true, 201, reportPeriodData,
        Config.get('responsemessage.SUPPLIER_RESPONSE.createSupplierReportPeriodSuccess'))

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
      const reportPeriodData = await SupplyChainReportingPeriod.getReportPeriodDetails('id', params.id)
      //:: Authorization (auth user can access their reporting periods data only)
      await bouncer.with('SupplyChainReportingPeriodPolicy').authorize('show', reportPeriodData.toJSON())

      return apiResponse(response, true, 200, reportPeriodData, 'Data Fetch Successfully')
    }
    catch (error) {
      console.log("err>>", error)
      return apiResponse(response, false, error.status, { "errors": error.message });

    }
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    try {
      let requestData = request.all()
      const reportPeriodData = await SupplyChainReportingPeriod.getReportPeriodDetails('id', params.id)

      //:: Authorization (auth user can update their reporting periods only)
      await bouncer.with('SupplyChainReportingPeriodPolicy').authorize('update', reportPeriodData.toJSON())

      // validate facility details
      await request.validate(SupplyChainReportingPeriodValidator)

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
        .from('supply_chain_reporting_periods')
        .where('organization_id', requestData.organizationId)
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

      const updatedPeriodData = await SupplyChainReportingPeriod.updateReportPeriod(reportPeriodData, requestData)

      return apiResponse(response, true, 200, updatedPeriodData,
        Config.get('responsemessage.SUPPLIER_RESPONSE.updateSupplierReportPeriodSuccess'))
    }
    catch (error) {
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

  public async destroy({ response, params, bouncer }: HttpContextContract) {
    try {
      const reportPeriodData = await SupplyChainReportingPeriod.getReportPeriodDetails('id', params.id)

      //:: Authorization (auth user can delete their reporting period data only)
      await bouncer.with('SupplyChainReportingPeriodPolicy').authorize('delete', reportPeriodData.toJSON())

      await SupplyChainReportingPeriod.deleteReportPeriod(reportPeriodData);

      return apiResponse(response, true, 200, [],
        Config.get('responsemessage.SUPPLIER_RESPONSE.supplierReportPeriodDeleteSuccess'))
    }
    catch (error) {
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


}

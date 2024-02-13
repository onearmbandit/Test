import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { apiResponse } from 'App/helpers/response'
import Config from '@ioc:Adonis/Core/Config';
import SupplyChainReportingPeriodValidator from 'App/Validators/Supplier/SupplyChainReportingPeriodValidator';
import SupplyChainReportingPeriod from 'App/Models/SupplyChainReportingPeriod';
import User from 'App/Models/User';

export default class SupplyChainReportingPeriodsController {
  public async index({ request, response,auth }: HttpContextContract) {
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

      // validate facility details
      await request.validate(SupplyChainReportingPeriodValidator)


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

  public async show({ response, params }: HttpContextContract) {
    try {
      const reportPeriodData = await SupplyChainReportingPeriod.getReportPeriodDetails('id', params.id)


      return apiResponse(response, true, 200, reportPeriodData, 'Data Fetch Successfully')
    }
    catch (error) {
      console.log("err>>", error)
      return apiResponse(response, false, error.status, { "errors": error.message });

    }
  }

  public async update({ request, response, params }: HttpContextContract) {
    try {
      let requestData = request.all()

      // validate facility details
      await request.validate(SupplyChainReportingPeriodValidator)

      const reportPeriodData = await SupplyChainReportingPeriod.updateReportPeriod(requestData, params)

      return apiResponse(response, true, 200, reportPeriodData,
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

  public async destroy({ response, params }: HttpContextContract) {
    try {
      await SupplyChainReportingPeriod.deleteReportPeriod(params);

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

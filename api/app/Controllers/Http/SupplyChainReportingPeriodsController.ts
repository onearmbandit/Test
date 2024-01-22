import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { apiResponse } from 'App/helpers/response'
import Config from '@ioc:Adonis/Core/Config';
import { v4 as uuidv4 } from 'uuid';
import Organization from 'App/Models/Organization'
import SupplyChainReportingPeriodValidator from 'App/Validators/Supplier/SupplyChainReportingPeriodValidator';
import SupplyChainReportingPeriod from 'App/Models/SupplyChainReportingPeriod';


export default class SupplyChainReportingPeriodsController {
  public async index({ }: HttpContextContract) { }

  public async store({ request, response, auth }: HttpContextContract) {
    try {
      let requestData = request.all()

      // validate facility details
      await request.validate(SupplyChainReportingPeriodValidator)

      const reportPeriodData = await SupplyChainReportingPeriod.createReportPeriod(requestData, auth)




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

  public async destroy({  response, params }: HttpContextContract) {
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

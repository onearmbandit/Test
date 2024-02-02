import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { apiResponse } from 'App/helpers/response'
import Config from '@ioc:Adonis/Core/Config';
import AddMultipleFacilityProductsValidator from 'App/Validators/FacilityProduct/AddMultipleFacilityProductsValidator';
import FacilityProduct from 'App/Models/FacilityProduct';
import FacilityEmission from 'App/Models/FacilityEmission';
import UpdateMultipleFacilityProductValidator from 'App/Validators/FacilityProduct/UpdateMultipleFacilityProductValidator';
// import UpdateMultipleFacilityProductValidator from 'App/Validators/FacilityProduct/UpdateMultipleFacilityProductValidator';

export default class FacilityProductsController {

  public async index({ }: HttpContextContract) {
  }

  public async store({ request, response }: HttpContextContract) {
    try {

      let requestData = request.all()

      // validate facility details
      await request.validate(AddMultipleFacilityProductsValidator)

      var emissionData = await FacilityEmission.getFacilityEmissionData('id', requestData.facilityEmissionId);

      // Assuming payload is an array of product data
      const createdFacilityProducts = await FacilityProduct.createFacilityProducts(emissionData, requestData);

      return apiResponse(response, true, 201, createdFacilityProducts,
        Config.get('responsemessage.ORGANIZATION_FACILITY_RESPONSE.createFacilityProductSuccess'))

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

  public async updateFacilityMultipleProducts({ request, response }) {
    try {

      let requestData = request.all()

      const facilityEmissionData = await FacilityEmission.getFacilityEmissionData('id', requestData.facilityEmissionId)

      await request.validate(UpdateMultipleFacilityProductValidator);

      const updateFacilityProducts = await FacilityProduct.updateOrCreateFacilityProducts(facilityEmissionData, requestData)

      return apiResponse(response, true, 200, updateFacilityProducts,
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

  public async calculateEqualityCarbonEmission({ request, response }) {
    try {

      const queryParams = request.qs();

      const facilityEmissionData = await FacilityEmission.getFacilityEmissionData('id', queryParams.facilityEmissionId)

      const calculatedEmission = await FacilityProduct.calculateCarbonEmission(facilityEmissionData)

      return apiResponse(response, true, 200, calculatedEmission,
        Config.get('responsemessage.ORGANIZATION_FACILITY_RESPONSE.equalityCarbonEmissionSuccess'))
    } catch (error) {

      if (error.status === 422) {
        return apiResponse(response, false, error.status, error.messages, Config.get('responsemessage.COMMON_RESPONSE.validationFailed'))
      }
      else {
        return apiResponse(response, false, 400, {}, error.messages ? error.messages : error.message)
      }
    }
  }


}

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { apiResponse } from 'App/helpers/response'
import Config from '@ioc:Adonis/Core/Config';
import AddMultipleFacilityProductsValidator from 'App/Validators/FacilityProduct/AddMultipleFacilityProductsValidator';
import FacilityProduct from 'App/Models/FacilityProduct';
import FacilityEmission from 'App/Models/FacilityEmission';
import UpdateMultipleFacilityProductValidator from 'App/Validators/FacilityProduct/UpdateMultipleFacilityProductValidator';
import OrganizationFacility from 'App/Models/OrganizationFacility';
// import UpdateMultipleFacilityProductValidator from 'App/Validators/FacilityProduct/UpdateMultipleFacilityProductValidator';
import Database from '@ioc:Adonis/Lucid/Database'


export default class FacilityProductsController {

  public async index({ request, response }: HttpContextContract) {
    try {
      const queryParams = request.qs();

      const facilityProducts = await FacilityProduct.getAllFacilityProducts(queryParams);

      const isPaginated = !request.input('per_page') || request.input('per_page') !== 'all';

      return apiResponse(response, true, 200, facilityProducts, Config.get('responsemessage.ORGANIZATION_FACILITY_RESPONSE.dataFetchSuccess'), isPaginated);

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

  public async updateFacilityMultipleProducts({ request, response, bouncer }) {
    //::Initialize database transaction
    const trx = await Database.transaction()

    try {

      let requestData = request.all()

      const facilityEmissionData = await FacilityEmission.getFacilityEmissionData('id', requestData.facilityEmissionId)


      //:: Authorization (auth user can update their facility's emissions data only)
      await bouncer.with('FacilityEmissionPolicy').authorize('update', facilityEmissionData)

      await request.validate(UpdateMultipleFacilityProductValidator);

      const updateFacilityProducts = await FacilityProduct.updateOrCreateFacilityProducts(facilityEmissionData, requestData, trx)

      //::commit database transaction
      await trx.commit()

      return apiResponse(response, true, 200, updateFacilityProducts,
        Config.get('responsemessage.ORGANIZATION_FACILITY_RESPONSE.updateFacilityProductSuccess'))
    } catch (error) {
      //::database transaction rollback if transaction failed
      await trx.rollback()

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

  public async getAllProductNames({ response, request }: HttpContextContract) {
    try {
      const queryParams = request.qs();
      //:: need to check facility emission/reporting period exist or not
      var facilityData = await OrganizationFacility.getOrganizationFacilityData('id', queryParams.organizationFacilityId ? queryParams.organizationFacilityId : '')

      if (facilityData) {
        const allProductNamesOfFacility = await FacilityProduct.getAllProductNames(queryParams)
        return apiResponse(response, true, 200, allProductNamesOfFacility, Config.get('responsemessage.COMMON_RESPONSE.getRequestSuccess'), false);
      }
    }
    catch (error) {
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

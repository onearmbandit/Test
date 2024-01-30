import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { apiResponse } from 'App/helpers/response'
import Config from '@ioc:Adonis/Core/Config';
// import { v4 as uuidv4 } from 'uuid';
import AddSupplierProductValidator from 'App/Validators/Supplier/AddSupplierProductValidator';
import SupplierProduct from 'App/Models/SupplierProduct';
import Supplier from 'App/Models/Supplier';


export default class SupplierProductsController {
  public async index({ request, response }: HttpContextContract) {
    try {
      const queryParams = request.qs();

      const allSupplierProductsData = await SupplierProduct.getAllSupplierProductsForSpecificPeriod(queryParams);

      const isPaginated = !request.input('perPage') || request.input('perPage') !== 'all';

      return apiResponse(response, true, 200, allSupplierProductsData, Config.get('responsemessage.COMMON_RESPONSE.getRequestSuccess'), isPaginated);

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

  public async store({ request, response }: HttpContextContract) {
    try {
      let requestData = request.all()

      await request.validate(AddSupplierProductValidator);

      var supplierData = await Supplier.getSupplierDetails('id', requestData.supplierId);

      var creationResult = await SupplierProduct.createSupplierProducts(supplierData, requestData)

      return apiResponse(response, true, 201, creationResult,
        Config.get('responsemessage.SUPPLIER_RESPONSE.productCreateSuccess'))

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

  public async show({ }: HttpContextContract) {
  }

  public async update({ }: HttpContextContract) {
  }

  public async destroy({ }: HttpContextContract) {
  }

  public async calculateProductEmissionData({ response, request }: HttpContextContract) {
    try {
      const queryParams = request.qs();

      const emissionData = await SupplierProduct.getProductsEmissionDataForSpecificPeriod(queryParams);
      let totalProductLevelEmission = 0;
      let productWise: any = [];
      let scopeEmissionNAProducts: any = []
      emissionData.forEach((ele) => {
        let productData = {
          name: ele.name,
          scope_3_contribution: ele.scope_3_contribution,
          functional_unit: ele.functional_unit,
          quantity: ele.quantity,
          type: ele.type
        }

        //:: Findout NA element count
        if (ele.scope_3_contribution == null || ele.scope_3_contribution == '' || ele.scope_3_contribution == 'NA') {
          scopeEmissionNAProducts.push(ele)
        }
        else {
          totalProductLevelEmission = totalProductLevelEmission + parseFloat(ele.scope_3_contribution)
        }
        productWise.push(productData)
      })

      //:: Calculated NA foot print product percentage
      let missingCarbonFootPrint = (scopeEmissionNAProducts.length / emissionData.length) * 100

      let resData = {
        totalProductLevelEmission: totalProductLevelEmission,
        productWise: productWise,
        missingCarbonFootPrint: missingCarbonFootPrint
      }

      return apiResponse(response, true, 200, resData, 'Data Fetch Successfully')
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


  public async getAllProductTypes({ response, request }: HttpContextContract) {
    try {
      const queryParams = request.qs();
      const allProductTypesOfSupplier =  await SupplierProduct.getAllProductTypesOfSuppliers(queryParams)
      return apiResponse(response, true, 200, allProductTypesOfSupplier, Config.get('responsemessage.COMMON_RESPONSE.getRequestSuccess'),false);

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

  public async getAllProductNames({ response, request }: HttpContextContract) {
    try {
      const queryParams = request.qs();
      const allProductNamesOfSupplier =  await SupplierProduct.getAllProductNamesOfSuppliers(queryParams)
      return apiResponse(response, true, 200, allProductNamesOfSupplier, Config.get('responsemessage.COMMON_RESPONSE.getRequestSuccess'),false);

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

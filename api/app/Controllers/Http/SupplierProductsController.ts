import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { apiResponse } from 'App/helpers/response'
import Config from '@ioc:Adonis/Core/Config';
// import { v4 as uuidv4 } from 'uuid';
import AddSupplierProductValidator from 'App/Validators/Supplier/AddSupplierProductValidator';
import SupplierProduct from 'App/Models/SupplierProduct';
import Supplier from 'App/Models/Supplier';
import SupplyChainReportingPeriod from 'App/Models/SupplyChainReportingPeriod';
import { DateTime } from 'luxon'
import DeleteMultipleSupplierProductValidator from 'App/Validators/Supplier/DeleteMultipleSupplierProductValidator';


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

  public async store({ request, response, auth }: HttpContextContract) {
    try {
      let requestData = request.all()

      await request.validate(AddSupplierProductValidator);

      var supplierData = await Supplier.getSupplierDetails('id', requestData.supplierId);

      var creationResult = await SupplierProduct.updateOrCreateSupplierProducts(supplierData, requestData, auth)

      return apiResponse(response, true, 201, creationResult,
        Config.get('responsemessage.SUPPLIER_RESPONSE.productCreateOrUpdateSuccess'))

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

  public async deleteMultipleSupplierProducts({ request, response }: HttpContextContract) {
    try {
      let requestData = request.all()
      if (requestData.products.length !== 0) {
        await SupplierProduct.deleteMultipleSupplierProducts(requestData)
        return apiResponse(response, true, 200, {}, Config.get('responsemessage.SUPPLIER_RESPONSE.multipleProductDeleteSuccess'))
      }
      return apiResponse(response, true, 200, {}, Config.get('responsemessage.SUPPLIER_RESPONSE.multipleProductDeleteSuccess')) 
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

  public async destroy({ response, request }: HttpContextContract) {
    try {
      const productDetailsData = await SupplierProduct.getProductDetailsData('id', request.param('id'))

      if (productDetailsData) {
        productDetailsData.deletedAt = DateTime.local()
        await productDetailsData.save()

        return apiResponse(response, true, 200, {}, Config.get('responsemessage.SUPPLIER_RESPONSE.productDeleteSuccess'))
      } else {
        return apiResponse(response, false, 401, {}, Config.get('responsemessage.SUPPLIER_RESPONSE.productNotFount'))
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

  public async calculateProductEmissionData({ response, request }: HttpContextContract) {
    try {
      const queryParams = request.qs();
      //:: need to check supply chain reporting period exist or not
      const reportPeriodData = await SupplyChainReportingPeriod.getReportPeriodDetails('id', queryParams.supplyChainReportingPeriodId ? queryParams.supplyChainReportingPeriodId : '')

      if (reportPeriodData) {
        const emissionData = await SupplierProduct.getProductsEmissionDataForSpecificPeriod(queryParams);
        let totalProductLevelEmission = 0;
        let productWise: any = [];
        let scopeEmissionNAProducts: any = []

        //:: Find unique entries because if product name same then need to give their total contribution
        let uniqueProducts: any = []
        emissionData.forEach((currentProduct) => {
          const existingProduct = uniqueProducts.find(
            (s) => (s.name === currentProduct.name)
          );

          if (existingProduct) {
            // Supplier with the same name already exists, calculate total
            existingProduct.scope_3_contribution =
              existingProduct.scope_3_contribution + currentProduct.scope_3_contribution;
          } else {
            uniqueProducts.push({ ...currentProduct });
          }
        });


        uniqueProducts.forEach((ele) => {
          let productData = {
            name: ele.name,
            scope_3_contribution: ele.scope_3_contribution,
            // functional_unit: ele.functional_unit,
            // quantity: ele.quantity,
            // type: ele.type
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
      //:: need to check supplier exist or not
      var supplierData = await Supplier.getSupplierDetails('id', queryParams.supplierId ? queryParams.supplierId : '')

      if (supplierData) {
        const allProductTypesOfSupplier = await SupplierProduct.getAllProductTypesOfSuppliers(queryParams)
        return apiResponse(response, true, 200, allProductTypesOfSupplier, Config.get('responsemessage.COMMON_RESPONSE.getRequestSuccess'), false);
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

  public async getAllProductNames({ response, request }: HttpContextContract) {
    try {
      const queryParams = request.qs();
      //:: need to check supplier exist or not
      var supplierData = await Supplier.getSupplierDetails('id', queryParams.supplierId ? queryParams.supplierId : '')

      if (supplierData) {
        const allProductNamesOfSupplier = await SupplierProduct.getAllProductNamesOfSuppliers(queryParams)
        return apiResponse(response, true, 200, allProductNamesOfSupplier, Config.get('responsemessage.COMMON_RESPONSE.getRequestSuccess'), false);
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

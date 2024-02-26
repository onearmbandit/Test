import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { apiResponse } from 'App/helpers/response'
import Config from '@ioc:Adonis/Core/Config';
import AddSupplierProductValidator from 'App/Validators/Supplier/AddSupplierProductValidator';
import SupplierProduct from 'App/Models/SupplierProduct';
import Supplier from 'App/Models/Supplier';
import SupplyChainReportingPeriod from 'App/Models/SupplyChainReportingPeriod';
import { DateTime } from 'luxon'
import User from 'App/Models/User';

export default class SupplierProductsController {
  /**
 * Returns a paginated list of all supplier products for a given supply chain reporting period. 
 * 
 * Authenticates the user and checks if the reporting period ID matches the user's organization.
 * 
 * Query parameters:
 * - supplyChainReportingPeriodId: ID of the supply chain reporting period to get products for
 * 
 * Returns:
 * - Paginated list of supplier products
 * - 403 if reporting period doesn't match user's organization 
*/
  public async index({ request, response, auth }: HttpContextContract) {
    try {
      const queryParams = request.qs();


      //:: Check organization id is same for auth user or not
      if (queryParams.supplyChainReportingPeriodId) {
        const userFound = await User.getUserDetails('id', auth.user?.id)
        const reportPeriodData = await SupplyChainReportingPeriod.getReportPeriodDetails('id', queryParams.supplyChainReportingPeriodId)
        let organizationIds = (await userFound.organizations).map((item) => item.id)
        if (!organizationIds.includes(reportPeriodData.organization.id)) {
          return apiResponse(
            response,
            false,
            403,
            {},
            "The provided supply chain reporting ID does not belongs to you."
          )
        }
      }

      const allSupplierProductsData = await SupplierProduct.getAllSupplierProductsForSpecificPeriod(queryParams);

      const isPaginated = !request.qs().perPage || request.qs().perPage !== 'all';

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

  /**
 * Creates or updates supplier products based on the request data.
 * 
 * Validates the request data against the validation rules. 
 * Gets the supplier details.
 * Calls the SupplierProduct model method to update or create the supplier products.
 */
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


  /**
 * Deletes multiple supplier products.
 * Returns success or error response.
*/
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


  /**
 * Deletes a supplier product by ID.
 * 
 * @param bouncer - The authorization service  
 * 
 * Gets the product details. Authorizes the deletion. 
 * Sets the deletedAt timestamp. Saves the product.
*/
  public async destroy({ response, request, bouncer }: HttpContextContract) {
    try {
      const productDetailsData = await SupplierProduct.getProductDetailsData('id', request.param('id'));

      //:: Authorization (auth user can access only their supplier data)
      await bouncer.with('SupplierProductsPolicy').authorize('delete', productDetailsData.toJSON())

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


  /**
 * Calculates product-level emission data for the given supply chain reporting period.
 * 
 * Fetches all product emission data for the period. 
 * Calculates total product emissions and percentage with missing data.
 * Returns aggregated emission data for the period.
*/
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
          totalProductLevelEmission: !Number.isNaN(totalProductLevelEmission) ? totalProductLevelEmission : 0,
          productWise: productWise,
          missingCarbonFootPrint: !Number.isNaN(missingCarbonFootPrint) ? missingCarbonFootPrint.toFixed(2) : 0
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


  /**
 * Gets all product types for a supplier.
 * Checks if the supplier exists based on the supplierId query parameter. 
 * If supplier exists, calls SupplierProduct.getAllProductTypesOfSuppliers() to get all product types for that supplier.
 * Returns API response with product types data and success message on success, validation error or error response on failure.
*/
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

  /**
 * Gets all product names for a supplier.
 * Checks if the supplier exists based on the supplierId query parameter.
 * If supplier exists, calls SupplierProduct.getAllProductNamesOfSuppliers() to get all product names for that supplier. 
 * Returns API response with product names data and success message on success, validation error or error response on failure.
*/
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

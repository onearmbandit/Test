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

  public async store ({ request, response}: HttpContextContract) {
    try {
      let requestData = request.all()

      await request.validate(AddSupplierProductValidator);

      var supplierData = await Supplier.getSupplierDetails('id', requestData.supplierId);

      var creationResult= await SupplierProduct.createSupplierProducts(supplierData,requestData)

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

  public async show ({}: HttpContextContract) {
  }

  public async update ({}: HttpContextContract) {
  }

  public async destroy ({}: HttpContextContract) {
  }
}

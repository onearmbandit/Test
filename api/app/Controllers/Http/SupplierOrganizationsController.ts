import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { apiResponse } from 'App/helpers/response'
import Config from '@ioc:Adonis/Core/Config'
import { v4 as uuidv4 } from 'uuid'
import SupplierOrganization from 'App/Models/SupplierOrganization'

export default class SupplierOrganizationsController {
  public async index({ request, response }: HttpContextContract) {
    try {
      const queryParams = request.qs()
      const allSuppliersData = await SupplierOrganization.getAllSuppliersWithOrganization(queryParams)


      return apiResponse(
        response,
        true,
        200,
        {},
        Config.get('responsemessage.COMMON_RESPONSE.getRequestSuccess'),
      )
    } catch (error) {
      console.log('error', error)
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

  public async store({ }: HttpContextContract) {
  }

  public async show({ }: HttpContextContract) {
  }


  public async update({ }: HttpContextContract) {
  }

  public async destroy({ }: HttpContextContract) {
  }
}

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { apiResponse } from 'App/helpers/response'
import User from 'App/Models/User'
import Config from '@ioc:Adonis/Core/Config'
import UpdateUserValidator from 'App/Validators/User/UpdateUserValidator'
import CreateFacilityValidator from 'App/Validators/Facility/CreateFacilityValidator'
import Facility from 'App/Models/Facility'

export default class FacilitiesController {
  public async index({}: HttpContextContract) {}

  public async create({ request, response }: HttpContextContract) {
    try {
      let requestData = request.all()

      // validate facility details
      await request.validate(CreateFacilityValidator)

      // create facility
      const result = await Facility.createFacility(requestData)

      return apiResponse(response, true, 200, result, 'Data saved successfully')
    } catch (error) {
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

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}

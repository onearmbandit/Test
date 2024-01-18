import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { apiResponse } from 'App/helpers/response'
import User from 'App/Models/User'
import Config from '@ioc:Adonis/Core/Config'
import UpdateUserValidator from 'App/Validators/User/UpdateUserValidator'

export default class UsersController {
  // public async index({}: HttpContextContract) {}

  // public async create({}: HttpContextContract) {}

  // public async store({}: HttpContextContract) {}

  public async show({ response, params }: HttpContextContract) {
    try {
      const userId = params.id
      const userDetails = await User.find(userId)

      if (!userDetails) {
        return apiResponse(response, false, 404, [], 'User not found')
      }

      return apiResponse(response, true, 200, userDetails, 'Data Fetch Successfully')
    } catch (error) {
      console.log('error >> ', error)
      return apiResponse(response, false, error.status, { 'errors ': error.message })
    }
  }

  public async update({ request, response, params }: HttpContextContract) {
    try {
      const userId = params.id
      const userDetails = await User.find(userId)
      if (!userDetails) {
        return apiResponse(response, false, 404, [], 'User not found')
      }

      let requestData = request.all()
      console.log(requestData)

      // validate user details
      await request.validate(UpdateUserValidator)

      // update user details
      const result = await userDetails.merge(requestData).save()

      return apiResponse(response, true, 200, result, 'Data Updated Successfully')
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

  public async destroy({}: HttpContextContract) {}
}

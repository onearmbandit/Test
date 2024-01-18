import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { apiResponse } from 'App/helpers/response'
import User from 'App/Models/User'
import Config from '@ioc:Adonis/Core/Config'
import UpdateUserValidator from 'App/Validators/User/UpdateUserValidator'
import Hash from '@ioc:Adonis/Core/Hash'



export default class UsersController {
  // public async index({}: HttpContextContract) {}

  // public async create({}: HttpContextContract) {}

  // public async store({}: HttpContextContract) {}

  public async show({ response, auth }: HttpContextContract) {
    try {
      if (auth.user) {
        const userDetails = await User.getLoggedInUser(auth.user)
        return apiResponse(response, true, 200, userDetails,
          Config.get('responsemessage.COMMON_RESPONSE.getRequestSuccess'))
      } else {
        return apiResponse(response, false, 401, {}, 'E_UNAUTHORIZED_ACCESS')
      }

    } catch (error) {
      console.log('error >> ', error)
      return apiResponse(response, false, error.status, { 'errors ': error.message })
    }
  }

  public async update({ request, response, auth }: HttpContextContract) {
    try {
      if (auth.user) {
        const userDetails = await User.getLoggedInUser(auth.user)

        let requestData = request.all()

        //::Verify current password
        if (requestData.oldPassword && !(await Hash.verify(userDetails.password, requestData.oldPassword))) {
          return apiResponse(response, false, 422,
            {
              'errors': [{
                field: 'oldPassword',
                message: Config.get('responsemessage.AUTH_RESPONSE.invalidOldPassword')
              }]
            },
            Config.get('responsemessage.COMMON_RESPONSE.validationFailed'));
        }


        // validate user details
        await request.validate(UpdateUserValidator)

        // update user details
        const result = await userDetails.merge({
          firstName: requestData.firstName,
          lastName: requestData.lastName,
          password: requestData.newPassword,
          email: requestData.email
        }).save()

        return apiResponse(response, true, 200, result, 'Data Updated Successfully')
      }
      else {
        return apiResponse(response, false, 401, {}, 'E_UNAUTHORIZED_ACCESS')
      }
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

  public async destroy({ request, response, auth }: HttpContextContract) {
    try {
      // Get the authenticated user
      // const user = auth.user;
      const user = await User.getLoggedInUser(auth.user)

      if (user) {
        // Confirm email and password
        const { email, password } = request.all();

        if (user.email !== email) {
          return apiResponse(response, false, 422,
            {
              'errors': [{
                field: 'email',
                message: Config.get('responsemessage.AUTH_RESPONSE.wrongUserEmail')
              }]
            },
            Config.get('responsemessage.COMMON_RESPONSE.validationFailed'));

        }

        if (!(await Hash.verify(user.password, password))) {
          return apiResponse(response, false, 422,
            {
              'errors': [{
                field: 'password',
                message: Config.get('responsemessage.AUTH_RESPONSE.wrongUserPassword')
              }]
            },
            Config.get('responsemessage.COMMON_RESPONSE.validationFailed'));
        }

        // Delete the user with softDelete
        await User.deleteUser(user)


        // await user.delete();

        return apiResponse(response, true, 200, {}, Config.get('responsemessage.AUTH_RESPONSE.authUserDeleteSuccess'))

      }
      else {
        return apiResponse(response, false, 401, {}, 'E_UNAUTHORIZED_ACCESS')
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

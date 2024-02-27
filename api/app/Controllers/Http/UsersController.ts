import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { apiResponse } from 'App/helpers/response'
import User from 'App/Models/User'
import Config from '@ioc:Adonis/Core/Config'
import UpdateUserValidator from 'App/Validators/User/UpdateUserValidator'
import Hash from '@ioc:Adonis/Core/Hash'
import Role from 'App/Models/Role'

export default class UsersController {


  /**
 * Handles showing the details of the currently authenticated user.
 * 
 * Tries to get the user details for the authenticated user from the auth object.
 * 
 * Returns a success response with the user details if authenticated.
 * Returns an unauthorized error response if not authenticated.
*/
  public async show({ response, auth }: HttpContextContract) {
    try {
      if (auth.user) {
        const userDetails = await User.getLoggedInUser(auth.user)
        return apiResponse(
          response,
          true,
          200,
          userDetails,
          Config.get('responsemessage.COMMON_RESPONSE.getRequestSuccess')
        )
      } else {
        return apiResponse(response, false, 401, {}, 'E_UNAUTHORIZED_ACCESS')
      }
    } catch (error) {
      console.log('error >> ', error)
      return apiResponse(response, false, error.status, { 'errors ': error.message })
    }
  }

  /**
 * Handles updating the details of the currently authenticated user.
 * 
 * Checks for authentication and gets user details.
 * Validates password if updating password. 
 * Validates updated fields against schema.
 * Updates user details in database.
*/
  public async update({ request, response, auth }: HttpContextContract) {
    try {
      if (auth.user) {
        const userDetails = await User.getLoggedInUser(auth.user)

        let requestData = request.all()

        //::Verify current password
        if (
          requestData.oldPassword &&
          !(await Hash.verify(userDetails.password, requestData.oldPassword))
        ) {
          return apiResponse(
            response,
            false,
            422,
            {
              errors: [
                {
                  field: 'oldPassword',
                  message: Config.get('responsemessage.AUTH_RESPONSE.invalidOldPassword'),
                },
              ],
            },
            Config.get('responsemessage.COMMON_RESPONSE.validationFailed')
          )
        }

        // validate user details
        await request.validate(UpdateUserValidator)

        // update user details
        const result = await userDetails
          .merge({
            firstName: requestData.firstName,
            lastName: requestData.lastName,
            password: requestData.newPassword,
            email: requestData.email,
          })
          .save()

        return apiResponse(response, true, 200, result, 'Data Updated Successfully')
      } else {
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

  /**
 * Deletes the authenticated user from the database.
 * Confirms the user's email and password before deleting.
 */
  public async destroy({ request, response, auth }: HttpContextContract) {
    try {
      // Get the authenticated user
      // const user = auth.user;
      const user = await User.getLoggedInUser(auth.user)

      if (user) {
        // Confirm email and password
        const { email, password } = request.all()

        if (user.email !== email) {
          return apiResponse(
            response,
            false,
            422,
            {
              errors: [
                {
                  field: 'email',
                  message: Config.get('responsemessage.AUTH_RESPONSE.wrongUserEmail'),
                },
              ],
            },
            Config.get('responsemessage.COMMON_RESPONSE.validationFailed')
          )
        }

        if (!(await Hash.verify(user.password, password))) {
          return apiResponse(
            response,
            false,
            422,
            {
              errors: [
                {
                  field: 'password',
                  message: Config.get('responsemessage.AUTH_RESPONSE.wrongUserPassword'),
                },
              ],
            },
            Config.get('responsemessage.COMMON_RESPONSE.validationFailed')
          )
        }

        // Delete the user with softDelete
        await User.deleteUser(user)

        // await user.delete();

        return apiResponse(
          response,
          true,
          200,
          {},
          Config.get('responsemessage.AUTH_RESPONSE.authUserDeleteSuccess')
        )
      } else {
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

/**
 * Gets a role by name.
 * 
 * @param params - The HTTP request parameters.
 * @returns The API response with the role data if found, otherwise a not found error.
*/
  public async getRoleByName({ response, params }: HttpContextContract) {
    try {
      // Get the authenticated user
      // const user = auth.user;
      console.log(params)
      const { name } = params

      if (name) {
        // Confirm email and password
        const result = await Role.getRoleByName(name)
        console.log(response)

        return apiResponse(response, true, 200, result, 'Data fetched Successfully')
      } else {
        return apiResponse(response, false, 404, {}, 'NOT_FOUND')
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
}

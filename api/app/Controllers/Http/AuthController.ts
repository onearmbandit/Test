import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { apiResponse } from 'App/helpers/response'
import { sendMail } from 'App/helpers/sendEmail'
import SignupValidator from 'App/Validators/Auth/SignupValidator'
import LoginValidator from 'App/Validators/Auth/LoginValidator'
import ForgotPasswordValidator from 'App/Validators/Auth/ForgotPasswordValidator'
import ResetPasswordValidator from 'App/Validators/Auth/ResetPasswordValidator'
import Config from '@ioc:Adonis/Core/Config'
import { DateTime } from 'luxon'
import Encryption from '@ioc:Adonis/Core/Encryption'
import Hash from '@ioc:Adonis/Core/Hash'
import { activeStatus } from 'App/helpers/constants'
import { string, safeEqual } from '@ioc:Adonis/Core/Helpers'
import moment from 'moment'
import { UserRoles } from 'App/helpers/constants'
import { v4 as uuidv4 } from 'uuid'
import Role from 'App/Models/Role'
import Organization from 'App/Models/Organization'
import SocialSignupOrLoginValidator from 'App/Validators/Auth/SocialSignupOrLoginValidator'
import OrganizationUser from 'App/Models/OrganizationUser'
import CreateOrganizationValidator from 'App/Validators/Organization/CreateOrganizationValidator'
import Supplier from 'App/Models/Supplier'
import SupplierOrganization from 'App/Models/SupplierOrganization'
import UpdateUserValidator from 'App/Validators/User/UpdateUserValidator'
import { createSlug } from 'App/helpers/helper'

const WEB_BASE_URL = process.env.WEB_BASE_URL

export default class AuthController {
  //register new user in first step of registration
  public async register({ request, response }: HttpContextContract) {
    try {
      await request.validate(SignupValidator)

      let requestData = request.all()
      const userExist = await User.getUserDetailsWithFirst('email', requestData.email)
      let role: any = await Role.getRoleByName(UserRoles.ADMIN)

      if (requestData.isSupplier) {
        role = await Role.getRoleByName(UserRoles.SUPPLIER)
      }

      if (userExist) {
        return apiResponse(
          response,
          false,
          422,
          {
            errors: [
              {
                field: 'email',
                message: Config.get('responsemessage.AUTH_RESPONSE.emailExists'),
              },
            ],
          },
          Config.get('responsemessage.COMMON_RESPONSE.validation_failed')
        )
      } else {
        //:: create slug using email data
        const slug = await createSlug(requestData.email.split('@')[0])
        const userData = await User.createUserWithRole(
          {
            id: uuidv4(),
            email: requestData.email,
            password: requestData.password,
            registrationStep: requestData.registrationStep ? requestData.registrationStep : 1,
            loginType: 'web',
            slug: slug
          },
          role
        )
        if (requestData.invitedUser) {
          let organizationUserData = await OrganizationUser.getOrganizationUserDetails(
            'email',
            requestData.email
          )
          organizationUserData
            ?.merge({
              user_id: userData.id,
            })
            .save()
        }

        return apiResponse(
          response,
          true,
          201,
          userData,
          Config.get('responsemessage.AUTH_RESPONSE.userCreated')
        )
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

  // update user data in second step
  public async updateNewUser({ request, response, params, auth }: HttpContextContract) {
    try {
      let requestData = request.all()

      const userData = await User.getUserDetails('slug', params.id)
      await request.validate(UpdateUserValidator)


      await userData
        .merge({
          firstName: requestData.firstName,
          lastName: requestData.lastName,
          emailVerifyToken: Encryption.encrypt(requestData.email),
          registrationStep: requestData.registrationStep ? requestData.registrationStep : 2,
        })
        .save()

      //   :: If user is invited then send another emails that's why added this flag
      if (requestData.invitedUser || requestData.throughSSO) {
        const emailData = {
          user: userData,
          url: `${WEB_BASE_URL}`,
        }

        await sendMail(userData.email, 'Welcome to Terralab!', 'emails/user_welcome', emailData)
        if (requestData.invitedUser && !requestData.isSupplier) {
          const token = await auth.use('api').generate(userData, {
            expiresIn: '1day',
          })
          return apiResponse(
            response,
            true,
            200,
            { token, userData },
            Config.get('responsemessage.AUTH_RESPONSE.loginSuccess')
          )
        } else {
          return apiResponse(
            response,
            true,
            201,
            userData,
            Config.get('responsemessage.AUTH_RESPONSE.signupSuccess')
          )
        }
      } else {
        //:: Only uninvited user
        const emailData = {
          user: userData,
          url: `${WEB_BASE_URL}/verify-email?token=${userData.emailVerifyToken}`,
        }

        await sendMail(
          userData.email,
          'Verify Your Email for Terralab',
          'emails/verify_email',
          emailData
        )
      }
      return apiResponse(
        response,
        true,
        201,
        userData,
        Config.get('responsemessage.AUTH_RESPONSE.signupSuccess')
      )
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

  // Crate create Organization in third step of register
  public async createOrganization({ request, response }: HttpContextContract) {
    try {
      let requestData = request.all()

      await request.validate(CreateOrganizationValidator)

      const userData = await User.getUserDetails('slug', requestData.userSlug)
      userData.registrationStep = requestData.registrationStep ? requestData.registrationStep : 3
      await userData.save()

      const organizationData = await Organization.createOrganization(requestData)

      //:: Add data in pivot table
      await userData.related('organizations').attach({
        [organizationData.id]: {
          id: uuidv4(),
          role_id: [userData.roles[0].id],
          user_id: [userData.id],
          invited_by: [userData.id],
          email: organizationData.companyEmail,
        },
      })

      if (requestData.isSupplier) {
        let supplierData = await Supplier.getSupplierDetails('email', userData.email)
        await SupplierOrganization.query()
          .where('supplier_id', supplierData.id)
          .update({
            supplier_organization_id: organizationData?.id,
          })
      }

      const user = await User.getUserDetails('id', userData.id)

      const emailData = {
        user: user,
        url: `${WEB_BASE_URL}`,
      }

      await sendMail(
        user.email,
        'Your Terralab Account Has Been Created!',
        'emails/user_new_account',
        emailData
      )

      return apiResponse(
        response,
        true,
        201,
        user,
        Config.get('responsemessage.AUTH_RESPONSE.createOrganizationSuccess')
      )
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

  //:: Verify email functionality
  public async verifyEmail({ request, response }: HttpContextContract) {
    try {
      const token = request.input('token')
      if (token) {
        const user = await User.getUserDetailsWithFirst('email_verify_token', token)
        if (user) {
          user.emailVerifiedAt = DateTime.now()
          user.emailVerifyToken = ''
          user.userStatus = activeStatus
          user.save()
          return apiResponse(
            response,
            true,
            200,
            {},
            Config.get('responsemessage.AUTH_RESPONSE.emailVerifySccess')
          )
        } else {
          return apiResponse(
            response,
            false,
            400,
            {},
            Config.get('responsemessage.AUTH_RESPONSE.emailTokenExpired')
          )
        }
      } else {
        return apiResponse(
          response,
          false,
          400,
          {},
          Config.get('responsemessage.AUTH_RESPONSE.emailUrlVerify')
        )
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

  //login existing user
  public async login({ auth, request, response }: HttpContextContract) {
    try {
      const payload = await request.validate(LoginValidator)
      const user = await User.getUserDetailsWithFirst('email', payload.email)
      if (user && user.userStatus == activeStatus) {
        const checkPass = await Hash.verify(user.password, payload.password)
        if (checkPass) {
          //:: method lookup the user from the database and verifies their password.
          const token = await auth.use('api').generate(user, {
            expiresIn: '1day',
          })
          return apiResponse(
            response,
            true,
            200,
            { token, user },
            Config.get('responsemessage.AUTH_RESPONSE.loginSuccess')
          )
        } else {
          return apiResponse(
            response,
            false,
            422,
            {
              errors: {
                field: 'password',
                message: Config.get('responsemessage.AUTH_RESPONSE.incorrectPassword'),
              },
            },
            Config.get('responsemessage.COMMON_RESPONSE.validationFailed')
          )
        }
      } else {
        return apiResponse(
          response,
          false,
          422,
          {
            errors: {
              field: 'email',
              message: Config.get('responsemessage.AUTH_RESPONSE.incorrectEmail'),
            },
          },
          Config.get('responsemessage.COMMON_RESPONSE.validationFailed')
        )
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

  public async forgotPassword({ request, response }: HttpContextContract) {
    try {
      const payload = await request.validate(ForgotPasswordValidator)

      //::Lookup user manually
      const user = await User.query()
        .where('email', payload.email)
        .where('userStatus', activeStatus)
        .first()

      //::Verify password
      if (!user) {
        return apiResponse(
          response,
          false,
          422,
          { errors: { email: [Config.get('responsemessage.AUTH_RESPONSE.userNotExist')] } },
          Config.get('responsemessage.COMMON_RESPONSE.validationFailed')
        )
      }

      //::Generate unique token
      const token = await this.createToken()
      user.rememberToken = token
      user.rememberTokenExpires = DateTime.now().plus({ hours: 1 })
      user.save()

      const emailData = {
        user: user,
        url: `${WEB_BASE_URL}/reset-password/${token}/${user.email}`,
      }

      await sendMail(user.email, 'Reset your password', 'emails/reset_password', emailData)

      return apiResponse(
        response,
        true,
        200,
        {},
        Config.get('responsemessage.AUTH_RESPONSE.forgotPasswordSuccess')
      )
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
   * Admin reset password API.
   */
  public async resetPassword({ request, response }: HttpContextContract) {
    try {
      await request.validate(ResetPasswordValidator)

      let requestData = request.all()

      //::Lookup user manually
      const user = await User.getUserDetails('email', requestData.email)

      //:: Check user's token and requestData token match or not
      if (!user.rememberToken || !safeEqual(requestData.token, user.rememberToken)) {
        return apiResponse(
          response,
          false,
          422,
          {
            errors: [
              {
                field: 'newPassword',
                message: Config.get('responsemessage.AUTH_RESPONSE.passwordTokenExpired'),
              },
            ],
          },
          Config.get('responsemessage.COMMON_RESPONSE.validation_failed')
        )
      }

      //::check is token expire
      let currentDateTime = moment()
      let expireDateTime = moment(`${user.rememberTokenExpires}`, 'YYYY-DD-MM HH:mm')
      var isBeforeDateTime = expireDateTime.isBefore(currentDateTime)

      if (isBeforeDateTime) {
        return apiResponse(
          response,
          false,
          422,
          {
            errors: [
              {
                field: 'newPassword',
                message: Config.get('responsemessage.AUTH_RESPONSE.passwordTokenExpired'),
              },
            ],
          },
          Config.get('responsemessage.COMMON_RESPONSE.validation_failed')
        )
      }

      user.password = requestData.newPassword
      user.rememberToken = null
      user.rememberTokenExpires = null
      await user.save()

      return apiResponse(
        response,
        true,
        200,
        {},
        Config.get('responsemessage.AUTH_RESPONSE.resetPasswordSuccess')
      )
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

  //:: Used for create reset-token
  private async createToken() {
    let token = string.generateRandom(25)
    const user = await User.findBy('remember_token', token)
    if (user) {
      return this.createToken()
    } else {
      return token
    }
  }

  //:: Social signup and login
  public async socialSignupAndLogin({ request, response, auth }: HttpContextContract) {
    try {
      await request.validate(SocialSignupOrLoginValidator)

      let requestData = request.all()
      let invitedUserExist = await OrganizationUser.query()
        .where('email', requestData.email)
        .first()
      // if (!invitedUserExist) {
      //     return apiResponse(response, false, 422, {
      //         'errors': [{
      //             field: 'email',
      //             message: Config.get('responsemessage.AUTH_RESPONSE.notMatchInvitedData')
      //         }]
      //     },
      //         Config.get('responsemessage.COMMON_RESPONSE.validation_failed'));
      // }

      const userExist = await User.getUserDetailsWithSocialToken(
        'email',
        requestData.email,
        requestData.socialLoginToken
      )
      const role: any = await Role.getRoleByName(UserRoles.ADMIN)

      if (!userExist && !invitedUserExist) {
        const userData = await User.createUserWithRole(
          {
            id: uuidv4(),
            email: requestData.email,
            socialLoginToken: requestData.socialLoginToken,
            loginType: requestData.loginType,
            firstName: requestData.firstName ? requestData.firstName : null,
            lastName: requestData.lastName ? requestData.lastName : null,
            emailVerifiedAt: DateTime.now(),
            emailVerifyToken: '',
            userStatus: activeStatus,
          },
          role
        )

        const token = await auth.use('api').generate(userData as User, {
          expiresIn: '1day',
        })

        return apiResponse(
          response,
          true,
          201,
          { token, user: userData },
          Config.get('responsemessage.AUTH_RESPONSE.userCreated')
        )
      } else {
        // userExist
        //   ?.merge({
        //     firstName: requestData.firstName ? requestData.firstName : null,
        //     lastName: requestData.lastName ? requestData.lastName : null,
        //     socialLoginToken: requestData.socialLoginToken,
        //     loginType: requestData.loginType,
        //   })
        //   .save()

        //:: Update organization user table entry
        let organizationUserData = await OrganizationUser.getOrganizationUserDetails(
          'email',
          requestData.email
        )
        organizationUserData
          ?.merge({
            user_id: userExist?.id,
          })
          .save()

        // const emailData = {
        //     user: userExist,
        //     url: `${WEB_BASE_URL}`,
        // }

        // await sendMail(userExist.email, 'Welcome to C3insets.ai!', 'emails/user_welcome', emailData)

        const token = await auth.use('api').generate(userExist as User, {
          expiresIn: '1day',
        })
        return apiResponse(
          response,
          true,
          200,
          { token, user: userExist },
          Config.get('responsemessage.AUTH_RESPONSE.loginSuccess')
        )

        // return apiResponse(response, false, 422, {
        //     'errors': [{
        //         field: 'email',
        //         message: Config.get('responsemessage.AUTH_RESPONSE.emailExists')
        //     }]
        // },
        //     Config.get('responsemessage.COMMON_RESPONSE.validation_failed'));
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

  public async socialLogin({ request, response, auth }: HttpContextContract) {
    try {
      await request.validate(SocialSignupOrLoginValidator)

      let requestData = request.all()
      const userExist = await User.getUserDetailsWithSocialToken(
        'email',
        requestData.email,
        requestData.socialLoginToken
      )

      if (userExist) {
        userExist
          .merge({
            socialLoginToken: requestData.socialLoginToken,
            loginType: requestData.loginType,
          })
          .save()

        //:: method lookup the user from the database and verifies their password.
        const token = await auth.use('api').generate(userExist, {
          expiresIn: '1day',
        })
        return apiResponse(
          response,
          true,
          200,
          { token, userExist },
          Config.get('responsemessage.AUTH_RESPONSE.loginSuccess')
        )
      } else {
        return apiResponse(
          response,
          false,
          422,
          {
            errors: {
              field: 'email',
              message: Config.get('responsemessage.AUTH_RESPONSE.incorrectEmail'),
            },
          },
          Config.get('responsemessage.COMMON_RESPONSE.validationFailed')
        )
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

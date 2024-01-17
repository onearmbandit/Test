import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { apiResponse } from 'App/helpers/response'
import { sendMail } from 'App/helpers/sendEmail'
import SignupValidator from 'App/Validators/Auth/SignupValidator'
import LoginValidator from 'App/Validators/Auth/LoginValidator'
import ForgotPasswordValidator from 'App/Validators/Auth/ForgotPasswordValidator'
import ResetPasswordValidator from 'App/Validators/Auth/ResetPasswordValidator'
import Config from '@ioc:Adonis/Core/Config';
import { DateTime } from 'luxon'
import Encryption from '@ioc:Adonis/Core/Encryption'
import Hash from '@ioc:Adonis/Core/Hash'
import { activeStatus } from 'App/helpers/constants'
import { string, safeEqual } from '@ioc:Adonis/Core/Helpers';
import moment from 'moment'

const WEB_BASE_URL = process.env.WEB_BASE_URL;

export default class AuthController {
    //register new user in first step of registration
    public async register({ request, response }: HttpContextContract) {

        try {
            await request.validate(SignupValidator);

            let requestData = request.all();
            const userExist = await User.query().where('email', requestData.email).first()
            if (userExist) {
                return apiResponse(response, false, 400, {}, Config.get('responsemessage.AUTH_RESPONSE.emailExists'))
            } else {
                const result = await User.create({
                    email: requestData.email,
                    password: requestData.password,
                    registrationStep: requestData.registrationStep ? requestData.registrationStep : 1,
                })

                const userData = await User.query().where('id', result.id).firstOrFail();

                //:: If user is invited then send another emails that's why added this flag
                if (requestData.invitedUser) {
                    const emailData = {
                        user: userData,
                        url: `${WEB_BASE_URL}`,
                    }

                    console.log("invitedUser")
                    await sendMail(userData.email, 'Welcome to C3insets.ai!', 'emails/user_welcome', emailData)
                    return apiResponse(response, true, 201, userData, Config.get('responsemessage.AUTH_RESPONSE.signupSuccess'))
                }
                else {
                    //     const emailData = {
                    //         user: userData,
                    //         url: `${WEB_BASE_URL}/verify-email?token=${userData.emailVerifyToken}`,
                    //     }

                    //     await sendMail(userData.email, 'Verify Your Email for C3', 'emails/verify_email', emailData)
                    return apiResponse(response, true, 201, userData, Config.get('responsemessage.AUTH_RESPONSE.userCreated'))
                }


            }
        } catch (error) {

            if (error.status === 422) {
                return apiResponse(response, false, error.status, error.messages, Config.get('responsemessage.COMMON_RESPONSE.validationFailed'))
            }
            else {
                return apiResponse(response, false, 400, {}, error.messages ? error.messages : error.message)
            }
        }
    }


    // update user data in second step
    public async updateNewUser({ request, response, params }: HttpContextContract) {

        try {
            let requestData = request.all();

            const userData = await User.query().where('id', params.id).firstOrFail();

            await userData.merge({
                firstName: requestData.firstName,
                lastName: requestData.lastName,
                emailVerifyToken: Encryption.encrypt(requestData.email),
                registrationStep: requestData.registrationStep ? requestData.registrationStep : 2,
            }).save();


            //:: Only uninvited user
            const emailData = {
                user: userData,
                url: `${WEB_BASE_URL}/verify-email?token=${userData.emailVerifyToken}`,
            }

            await sendMail(userData.email, 'Verify Your Email for C3', 'emails/verify_email', emailData)
            return apiResponse(response, true, 201, userData, Config.get('responsemessage.AUTH_RESPONSE.signupSuccess'))

        }
        catch (error) {
            if (error.status === 422) {
                return apiResponse(response, false, error.status, error.messages, Config.get('responsemessage.COMMON_RESPONSE.validationFailed'))
            }
            else {
                return apiResponse(response, false, 400, {}, error.messages ? error.messages : error.message)
            }
        }
    }

    // Crate create Organization in third step of register
    public async createOrganization({ request, response }: HttpContextContract) {
        try {
            let requestData = request.all();

            const userData = await User.query().where('slug', requestData.userSlug).firstOrFail();

            userData.registrationStep = requestData.registrationStep ? requestData.registrationStep : 3;
            userData.save();
            await userData.related('organization').create({
                companyName: requestData.companyName,
                addressLine_1: requestData.addressLine1,
                addressLine_2: requestData.addressLine2,
                city: requestData.city,
                state: requestData.state,
                zipCode: requestData.zipCode,
            });


            const user = await User.query().where('id', userData.id).preload('organization').firstOrFail();

            console.log("user", user)
            const emailData = {
                user: user,
                url: `${WEB_BASE_URL}`,
            }

            await sendMail(user.email, 'Your C3 Account Has Been Created!', 'emails/user_new_account', emailData)

            return apiResponse(response, true, 201, user, Config.get('responsemessage.AUTH_RESPONSE.createOrganizationSuccess'))

        }
        catch (error) {
            if (error.status === 422) {
                return apiResponse(response, false, error.status, error.messages, Config.get('responsemessage.COMMON_RESPONSE.validationFailed'))
            }
            else {
                return apiResponse(response, false, 400, {}, error.messages ? error.messages : error.message)
            }
        }

    }

    //:: Verify email functionality
    public async verifyEmail({ request, response }: HttpContextContract) {
        try {
            const token = request.input('token')
            if (token) {
                const user = await User.query().where('email_verify_token', token).preload('organization').first();
                if (user) {
                    user.emailVerifiedAt = DateTime.now();
                    user.emailVerifyToken = '';
                    user.userStatus = activeStatus
                    user.save()
                    return apiResponse(response, true, 200, {}, Config.get('responsemessage.AUTH_RESPONSE.emailVerifySccess'))

                } else {
                    return apiResponse(response, false, 400, {}, Config.get('responsemessage.AUTH_RESPONSE.emailTokenExpired'))
                }
            } else {
                return apiResponse(response, false, 400, {}, Config.get('responsemessage.AUTH_RESPONSE.emailUrlVerify'))
            }
        } catch (error) {
            if (error.status === 422) {
                return apiResponse(response, false, error.status, error.messages, Config.get('responsemessage.COMMON_RESPONSE.validationFailed'))
            }
            else {
                return apiResponse(response, false, 400, {}, error.messages ? error.messages : error.message)
            }
        }
    }


    //login existing user
    public async login({ auth, request, response }: HttpContextContract) {
        try {
            const payload = await request.validate(LoginValidator)
            const user = await User.query().where('email', payload.email).preload('organization').first()
            if (user && user.userStatus == activeStatus) {
                const checkPass = await Hash.verify(user.password, payload.password)
                if (checkPass) {
                    //:: method lookup the user from the database and verifies their password.
                    const token = await auth.use('api').generate(user, {
                        expiresIn: '1day'
                    })
                    return apiResponse(response, true, 200, { token, user },
                        Config.get('responsemessage.AUTH_RESPONSE.loginSuccess'))
                }
                else {
                    return apiResponse(response, false, 422, {
                        'errors': {
                            "field": "password",
                            "message": Config.get('responsemessage.AUTH_RESPONSE.incorrectPassword')
                        }
                    }, Config.get('responsemessage.COMMON_RESPONSE.validationFailed'))
                }
            }
            else {
                return apiResponse(response, false, 422, {
                    'errors': {
                        "field": "email",
                        "message": Config.get('responsemessage.AUTH_RESPONSE.incorrectEmail')
                    }
                }, Config.get('responsemessage.COMMON_RESPONSE.validationFailed'))
            }

        } catch (error) {
            if (error.status === 422) {
                return apiResponse(response, false, error.status, error.messages, Config.get('responsemessage.COMMON_RESPONSE.validationFailed'))
            }
            else {
                return apiResponse(response, false, 400, {}, error.messages ? error.messages : error.message)
            }
        }
    }


    public async forgotPassword({ request, response }: HttpContextContract) {
        try {
            const payload = await request.validate(ForgotPasswordValidator)

            //::Lookup user manually
            const user = await User
                .query()
                .where('email', payload.email)
                .where('userStatus', activeStatus)
                .first();

            //::Verify password
            if (!user) {
                return apiResponse(response, false, 422, { 'errors': { email: [Config.get('responsemessage.AUTH_RESPONSE.userNotExist')] } },
                    Config.get('responsemessage.COMMON_RESPONSE.validationFailed'))
            }

            //::Generate unique token
            const token = await this.createToken();
            user.rememberToken = token
            user.rememberTokenExpires = DateTime.now().plus({ hours: 1 })
            user.save();

            const emailData = {
                user: user,
                url: `${WEB_BASE_URL}/reset-password/${token}/${user.email}`,
            }

            await sendMail(user.email, 'Reset your password', 'emails/reset_password', emailData)

            return apiResponse(response, true, 200, {}, Config.get('responsemessage.AUTH_RESPONSE.forgotPasswordSuccess'))
        }

        catch (error) {
            if (error.status === 422) {
                return apiResponse(response, false, error.status, error.messages, Config.get('responsemessage.COMMON_RESPONSE.validationFailed'))
            }
            else {
                return apiResponse(response, false, 400, {}, error.messages ? error.messages : error.message)
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
            const user = await User
                .query()
                .where('email', requestData.email)
                .firstOrFail();

            //:: Check user's token and requestData token match or not
            if (!user.rememberToken || !safeEqual(requestData.token, user.rememberToken)) {
                return apiResponse(response, false, 422, {
                    'errors': [{
                        field: 'newPassword',
                        message: Config.get('responsemessage.AUTH_RESPONSE.passwordTokenExpired')
                    }]
                }, Config.get('responsemessage.COMMON_RESPONSE.validation_failed'));
            }

            //::check is token expire
            let currentDateTime = moment();
            let expireDateTime = moment(`${user.rememberTokenExpires}`, 'YYYY-DD-MM HH:mm');
            var isBeforeDateTime = expireDateTime.isBefore(currentDateTime);

            if (isBeforeDateTime) {
                return apiResponse(response, false, 422, {
                    'errors': [{
                        field: 'newPassword',
                        message: Config.get('responsemessage.AUTH_RESPONSE.passwordTokenExpired')
                    }]
                },
                    Config.get('responsemessage.COMMON_RESPONSE.validation_failed'));
            }

            user.password = requestData.newPassword;
            user.rememberToken = null;
            user.rememberTokenExpires = null;
            await user.save();


            return apiResponse(response, true, 200, {}, Config.get('responsemessage.AUTH_RESPONSE.resetPasswordSuccess'))
        }
        catch (error) {
            if (error.status === 422) {
                return apiResponse(response, false, error.status, error.messages, Config.get('responsemessage.COMMON_RESPONSE.validationFailed'))
            }
            else {
                return apiResponse(response, false, 400, {}, error.messages ? error.messages : error.message)
            }
        }
    }



    //:: Used for create reset-token
    private async createToken() {
        let token = string.generateRandom(25);
        const user = await User.findBy('remember_token', token);
        if (user) {
            return this.createToken()
        } else {
            return token;
        }
    }
}

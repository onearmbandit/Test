import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { apiResponse } from 'App/helpers/response'
import { sendMail } from 'App/helpers/sendEmail'
import SignupValidator from 'App/Validators/Auth/SignupValidator'
import LoginValidator from 'App/Validators/Auth/LoginValidator'
import Config from '@ioc:Adonis/Core/Config';
import Database from '@ioc:Adonis/Lucid/Database'
import { DateTime } from 'luxon'
import Encryption from '@ioc:Adonis/Core/Encryption'
import Hash from '@ioc:Adonis/Core/Hash'
import { activeStatus } from 'App/helpers/constants'

const WEB_BASE_URL = process.env.WEB_BASE_URL;
const APP_URL = process.env.APP_URL;

export default class AuthController {
    //register new user
    public async register({ request, response }: HttpContextContract) {
        const trx = await Database.transaction()

        try {
            await request.validate(SignupValidator);

            let requestData = request.all();
            const userExist = await User.query().where('email', requestData.email).first()
            if (userExist) {
                return apiResponse(response, false, 400, {}, Config.get('responsemessage.AUTH_RESPONSE.emailExists'))
            } else {
                const userData = await User.create({
                    first_name: requestData.first_name,
                    last_name: requestData.last_name,
                    email: requestData.email,
                    password: requestData.password,
                    emailVerifyToken: Encryption.encrypt(requestData.email)
                }, { client: trx })

                await userData.related('workData').create({
                    company_name: requestData.company_name,
                    company_street_address: requestData.company_street_address,
                    floor: requestData.floor,
                    city: requestData.city,
                    state: requestData.state,
                    zip_code: requestData.zip_code
                }, { client: trx });


                const user = await User.query().where('id', userData.id).preload('workData').first();

                //::commit database transaction
                await trx.commit();

                //:: If user is invited then send another emails that's why added this flag
                if (requestData.invitedUser) {
                    const emailData = {
                        user: userData,
                        url: `${WEB_BASE_URL}`,
                    }

                    console.log("invitedUser")
                    await sendMail(userData.email, 'Welcome to C3insets.ai!', 'emails/user_welcome', emailData)
                }
                else {
                    const emailData = {
                        user: userData,
                        url: `${WEB_BASE_URL}/verify-email?token=${userData.emailVerifyToken}`,
                    }

                    await sendMail(userData.email, 'Verify Your Email for C3', 'emails/verify_email', emailData)
                }


                return apiResponse(response, true, 201, user, Config.get('responsemessage.AUTH_RESPONSE.signupSuccess'))
            }
        } catch (error) {
            //::database transaction rollback if transaction failed
            await trx.rollback();

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
                const user = await User.query().where('email_verify_token', token).preload('workData').first();
                if (user) {
                    user.emailVerifiedAt = DateTime.now();
                    user.emailVerifyToken = '';
                    user.userStatus= activeStatus
                    user.save()

                    const emailData = {
                        user: user,
                        url: `${WEB_BASE_URL}`,
                    }

                    await sendMail(user.email, 'Your C3 Account Has Been Created!', 'emails/user_new_account', emailData)
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
            const user = await User.query().where('email', payload.email).preload('workData').first()
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
}

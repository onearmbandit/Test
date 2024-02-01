import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { sendMail } from 'App/helpers/sendEmail'

const WEB_BASE_URL = process.env.WEB_BASE_URL

export default class DevTestsController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}

  public async sendTestMail({ request, response }: HttpContextContract) {
    try {
      let mailSent = ''
      const requestData = request.all()

      const email = requestData.email

      switch (requestData.type) {
        case 'verify-email':
          const userData = {
            firstName: 'John',
            lastName: 'Doe',
          }
          const emailData = {
            user: userData,
            url: `${WEB_BASE_URL}`,
          }

          await sendMail(
            email,
            'Dev-test: Verify your email for Terralab',
            'emails/verify_email',
            emailData
          )

          mailSent = 'verify-email'
          break

        case 'invite-organization':
          const orgEmailData = {
            fullName: 'John Doe',
            initials: 'JD',
            organizationName: 'CXR Agency',
            url: `${WEB_BASE_URL}`,
          }

          await sendMail(
            email,
            `Dev-test: You've been invited to Terralab Insets`,
            'emails/invite_organization',
            orgEmailData
          )

          mailSent = 'invite-organization'
          break

        case 'reset-password':
          const resetPassEmailData = {
            user: {
              firstName: 'John',
              lastName: 'Doe',
            },
            url: `${WEB_BASE_URL}`,
          }

          await sendMail(
            email,
            `Dev-test: Reset your password`,
            'emails/reset_password',
            resetPassEmailData
          )

          mailSent = 'reset-password'
          break

        case 'welcome-user':
          const welcomeUserEmailData = {
            user: {
              firstName: 'John',
              lastName: 'Doe',
            },
            url: `${WEB_BASE_URL}`,
          }

          await sendMail(
            email,
            `Dev-test: Welcome to Terralab`,
            'emails/user_welcome',
            welcomeUserEmailData
          )

          mailSent = 'welcome-user'
          break

        case 'user-new-account':
          const userNewAccountEmailData = {
            user: {
              firstName: 'John',
              lastName: 'Doe',
            },
            url: `${WEB_BASE_URL}`,
          }

          await sendMail(
            email,
            `Dev-test: Your Terralab account has been created`,
            'emails/user_new_account',
            userNewAccountEmailData
          )

          mailSent = 'user-new-account'
          break

        case 'invite-sub-user':
          const inviteSubUserEmailData = {
            user: {
              firstName: 'John',
              lastName: 'Doe',
            },
            url: `${WEB_BASE_URL}`,
          }

          await sendMail(
            email,
            `Dev-test: Invitation to join Terralab`,
            'emails/invite_sub_user',
            inviteSubUserEmailData
          )

          mailSent = 'invite-sub-user'
          break

        default:
          mailSent = 'Invalid Type'
          break
      }
      if (mailSent === 'Invalid Type') {
        return response.status(400).send({ status: true, message: mailSent })
      }

      return response.status(200).send({ status: true, message: mailSent })
    } catch (error) {
      console.log(error)
      return response.status(500).send({ status: false, message: error.message })
    }
  }
}

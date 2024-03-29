import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Config from '@ioc:Adonis/Core/Config'
import OrganizationUser from 'App/Models/OrganizationUser'
import InviteOrganizationValidator from 'App/Validators/OrganizationUser/InviteOrganizationValidator'
import { apiResponse } from 'App/helpers/response'
import { sendMail } from 'App/helpers/sendEmail'
import User from 'App/Models/User'

const WEB_BASE_URL = process.env.WEB_BASE_URL

export default class OrganizationUsersController {


  /**
 * Invites a user to join the organization via email.
 * 
 * Validates the invite request data, creates an OrganizationUser invite record, 
 * generates a welcome email with invite link, and sends it to the invited user.
 * 
 * Returns API response with invite result on success, validation errors or 
 * error messages on failure.
 */
  public async inviteOrganization({ request, response, bouncer, auth }: HttpContextContract) {
    try {
      await bouncer.with('OrganizationUserPolicy').authorize('invite')
      const invitedBy = await User.getUserDetails('id', auth?.user?.id)

      //:: only super admin can access this endpoint to invite an organization

      let requestData = request.all()

      // // validate facility details
      await request.validate(InviteOrganizationValidator)

      // create organization user
      const result = await OrganizationUser.createInvite(requestData)

      const emailData = {
        initials: invitedBy.firstName[0] + invitedBy.lastName[0],
        fullName: `${invitedBy.firstName} ${invitedBy.lastName}`,
        organizationName: 'Terralab',
        email: result.email,
        url: `${WEB_BASE_URL}/register?email=${requestData?.email}`,
      }

      await sendMail(
        emailData.email,
        `You've been invited to Terralab Insets by Terralab`,
        'emails/invite_organization',
        emailData
      )

      return apiResponse(response, true, 200, result, 'Data saved successfully')
    } catch (error) {
      console.log('error : ', error)
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

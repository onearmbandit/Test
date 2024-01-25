import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { apiResponse } from 'App/helpers/response'
import { sendMail } from 'App/helpers/sendEmail'
import Config from '@ioc:Adonis/Core/Config';
import Organization from 'App/Models/Organization';
import UpdateOrganizationValidator from 'App/Validators/Organization/UpdateOrganizationValidator';
import { v4 as uuidv4 } from 'uuid';


const WEB_BASE_URL = process.env.WEB_BASE_URL;


export default class OrganizationsController {
  public async index({ }: HttpContextContract) {
  }

  public async store({ }: HttpContextContract) {
  }


  //:: GEt data of organization
  public async show({ response, params, bouncer }: HttpContextContract) {
    try {
      const organizationData = await Organization.getOrganizationDetails('id', params.id)

      //:: Authorization (every user can access their organization only)
      await bouncer
        .with('OrganizationPolicy')
        .authorize('view', organizationData)

      return apiResponse(response, true, 200, organizationData, 'Data Fetch Successfully')
    }
    catch (error) {
      console.log("err>>", error)
      return apiResponse(response, false, error.status, { "errors": error.message });

    }
  }


  public async update({ request, response, params, bouncer, auth }: HttpContextContract) {
    try {
      let requestData = request.all();
      const organizationData = await Organization.getOrganizationDetails('id', params.id)

      //:: Authorization (every user can update their organization only)
      await bouncer
        .with('OrganizationPolicy')
        .authorize('update', organizationData)

        await request.validate(UpdateOrganizationValidator);

      // need of profileStep flag send invite mail for new user
      if (requestData.profileStep == 1) {
        //:: Check mail is updated or not then send email to user
        if (organizationData.companyEmail !== requestData.companyEmail) {
          //:: Only uninvited user
          const emailData = {
            user: auth.user,
            url: `${WEB_BASE_URL}?email=${requestData.companyEmail}`,
          }

          let userEmail = auth.user ? auth.user.email : ''
          let userName = auth.user ? `${auth.user.firstName} ${auth.user.lastName}` : ''

          await sendMail(userEmail, `${userName} invited you to join C3 Insets`, 'emails/invite_sub_user', emailData)


          //:: If email different then only new user added in user table
          // const role = await Role.getRoleByName(UserRoles.SUB_ADMIN)  //sub admin
          // const userData = await User.createUserWithRole({
          //   id: uuidv4(),
          //   email: requestData.companyEmail,
          //   password: string.generateRandom(8),
          //   registrationStep: 1,
          // }, role)

          //:: Add data in pivot table organization_users
          await auth.user?.related('organizations').attach({
            [organizationData.id]: {
              id: uuidv4(),
              // role_id: [userData.roles[0].id],
              // user_id: null,  // keep null as of now
              invited_by:[auth.user?.id],
              email:requestData.companyEmail
            }
          })
        }
      }

      //:: Update fields value
      const result = await Organization.updateOrganization(organizationData, {
        companyName: requestData.companyName,
        companySize: requestData.companySize,
        companyEmail: requestData.companyEmail,
        selfPointOfContact: requestData.selfPointOfContact,
        naicsCode: requestData.naicsCode,
        climateTargets: await Organization.setTargets(requestData.climateTargets),
        addressLine_1: requestData.addressLine1,
        addressLine_2: requestData.addressLine2,
        city: requestData.city,
        state: requestData.state,
        country: requestData.country,
        zipcode: requestData.zipCode,

      })


      return apiResponse(response, true, 200, result,
        Config.get('responsemessage.ORGANIZATION_RESPONSE.updateOrganizationSuccess'))
    } catch (error) {

      if (error.status === 422) {
        return apiResponse(response, false, error.status, error.messages, Config.get('responsemessage.COMMON_RESPONSE.validationFailed'))
      }
      else {
        return apiResponse(response, false, 400, {}, error.messages ? error.messages : error.message)
      }
    }
  }

  public async destroy({ }: HttpContextContract) {
  }
}

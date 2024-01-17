import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { apiResponse } from 'App/helpers/response'
// import { sendMail } from 'App/helpers/sendEmail'
import Config from '@ioc:Adonis/Core/Config';
import Organization from 'App/Models/Organization';
import UpdateOrganizationValidator from 'App/Validators/Organization/UpdateOrganizationValidator';
import User from 'App/Models/User';
import { v4 as uuidv4 } from 'uuid';
import Role from 'App/Models/Role'
import { UserRoles } from 'App/helpers/constants'


// const WEB_BASE_URL = process.env.WEB_BASE_URL;


export default class OrganizationsController {
  public async index({ }: HttpContextContract) {
  }

  public async store({ }: HttpContextContract) {
    // try {
    //   await request.validate(UpdateOrganizationValidator);
    //   let requestData = request.all();

    //   const authenticatedUser = auth.user;

    //   const organizationData = new Organization();
    //   // need of profileStep flag send invite mail for new user
    //   if (requestData.profileStep == 1) {
    //     //:: Check mail is updated or not then send email to user
    //     if (requestData.selfPointOfContact == 1) {
    //       //send mail for new user
    //       console.log("mail send??")
    //     }

    //     organizationData.companyEmail = requestData.companyEmail
    //     organizationData.selfPointOfContact == requestData.selfPointOfContact
    //   }

    //   organizationData.companyName = requestData.companyName
    //   organizationData.companySize = requestData.companySize
    //   organizationData.selfPointOfContact = requestData.selfPointOfContact
    //   organizationData.naicsCode = requestData.naicsCode

    //   // / Associate the organization with the authenticated user
    //   await authenticatedUser?.related('organization').save(organizationData);
    //   return apiResponse(response, true, 200, organizationData,
    //     Config.get('responsemessage.ORGANIZATION_RESPONSE.createOrganizationSuccess'))
    // }
    // catch (error) {

    //   if (error.status === 422) {
    //     return apiResponse(response, false, error.status, error.messages, Config.get('responsemessage.COMMON_RESPONSE.validationFailed'))
    //   }
    //   else {
    //     return apiResponse(response, false, 400, {}, error.messages ? error.messages : error.message)
    //   }
    // }

  }


  //:: GEt data of organization
  public async show({ response, params }: HttpContextContract) {
    try {
      const organizationData = await Organization.getOrganizationDetails('id', params.id)

      return apiResponse(response, true, 200, organizationData, 'Data Fetch Successfully')
    }
    catch (error) {
      console.log("err>>", error)
      return apiResponse(response, false, error.status, { "errors": error.message });

    }
  }


  public async update({ request, response, params }: HttpContextContract) {
    try {
      await request.validate(UpdateOrganizationValidator);
      let requestData = request.all();
      const organizationData = await Organization.getOrganizationDetails('id', params.id)

      // need of profileStep flag send invite mail for new user
      if (requestData.profileStep == 1) {
        //:: Check mail is updated or not then send email to user
        if (organizationData.companyEmail !== requestData.companyEmail) {
          //send mail for new user
          console.log("mail send??")


          //:: If email different then only new user added in it
          const role: any = await Role.getRoleByName(UserRoles.ADMIN)
          await User.createUserWithRole({
            id: uuidv4(),
            email: requestData.email,
            password: requestData.password,
            registrationStep: requestData.registrationStep ? requestData.registrationStep : 1,
          }, role)
        }


      }

      //:: Update fields value
      await Organization.updateOrganization(organizationData, {
        companyName: requestData.companyName,
        companySize: requestData.companySize,
        companyEmail: requestData.companyEmail,
        selfPointOfContact: requestData.selfPointOfContact,
        naicsCode: requestData.naicsCode,
        targets: await Organization.setTargets(requestData.targets),
        addressLine_1: requestData.addressLine1,
        addressLine_2: requestData.addressLine2,
        city: requestData.city,
        state: requestData.state,
        country: requestData.country,
        zipcode: requestData.zipCode,

      })


      return apiResponse(response, true, 200, organizationData,
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

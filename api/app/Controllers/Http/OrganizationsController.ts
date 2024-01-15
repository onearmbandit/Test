import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { apiResponse } from 'App/helpers/response'
import { sendMail } from 'App/helpers/sendEmail'
import Config from '@ioc:Adonis/Core/Config';
import Organization from 'App/Models/Organization';
import UpdateOrganizationValidator from 'App/Validators/Organization/UpdateOrganizationValidator';

const WEB_BASE_URL = process.env.WEB_BASE_URL;


export default class OrganizationsController {
  public async index({ }: HttpContextContract) {
  }

  public async store({ request, response, auth }: HttpContextContract) {
    try {
      await request.validate(UpdateOrganizationValidator);
      let requestData = request.all();

      const authenticatedUser = auth.user;

      const organizationData = new Organization();
      // need of profileStep flag send invite mail for new user
      if (requestData.profileStep == 1) {
        //:: Check mail is updated or not then send email to user
        if (requestData.selfPointOfContact == 1) {
          //send mail for new user
          console.log("mail send??")
        }

        organizationData.companyEmail = requestData.companyEmail
        organizationData.selfPointOfContact == requestData.selfPointOfContact
      }

      organizationData.companyName = requestData.companyName
      organizationData.companySize = requestData.companySize
      organizationData.selfPointOfContact = requestData.selfPointOfContact
      organizationData.naicsCode = requestData.naicsCode

      // / Associate the organization with the authenticated user
      await authenticatedUser?.related('organization').save(organizationData);
      return apiResponse(response, true, 200, organizationData,
        Config.get('responsemessage.ORGANIZATION_RESPONSE.createOrganizationSuccess'))
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


  //:: GEt data of organization
  public async show({ request, response, params }: HttpContextContract) {
    try {
      const organizationData = await Organization.query().where('id', params.id).firstOrFail();

      return apiResponse(response, true, 200, organizationData, 'Data Fetch Successfully')
    }
    catch (error) {
      console.log("err>>",error)
      return apiResponse(response, false, error.status, { "errors": error.message });

    }
  }


  public async update({ request, response, params }: HttpContextContract) {
    try {
      await request.validate(UpdateOrganizationValidator);
      let requestData = request.all();
      const organizationData = await Organization.query().where('id', params.id).firstOrFail();

      // need of profileStep flag send invite mail for new user
      if (requestData.profileStep == 1) {
        //:: Check mail is updated or not then send email to user
        if (organizationData.companyEmail !== requestData.companyEmail && requestData.selfPointOfContact == 1) {
          //send mail for new user
          console.log("mail send??")
        }

        organizationData.companyEmail = requestData.companyEmail
        organizationData.selfPointOfContact == requestData.selfPointOfContact
        await organizationData.save();
      }


      //:: Update fields value
      await organizationData.merge({
        companyName: requestData.companyName,
        companySize: requestData.companySize,
        selfPointOfContact: requestData.selfPointOfContact,
        naicsCode: requestData.naicsCode,
        targets: await Organization.setTargets(requestData.targets)
      }).save()


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

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { apiResponse } from 'App/helpers/response'
import Config from '@ioc:Adonis/Core/Config'
import CreateAbatementProjectValidator from 'App/Validators/AbatementProjects/CreateAbatementProjectValidator'
import AbatementProject from 'App/Models/AbatementProject'
import Organization from 'App/Models/Organization'

export default class AbatementProjectsController {
  public async index({ }: HttpContextContract) {
  }

  public async store({ request, response, auth }: HttpContextContract) {
    try {
      let requestData = request.all()
      await request.validate(CreateAbatementProjectValidator)

      var organizationData: any = await Organization.getOrganizationDetails(
        'id', ''
      )

      let createdProjectData = await AbatementProject.createNewProject(requestData, auth, organizationData = {})

      return apiResponse(
        response,
        true,
        201,
        createdProjectData,
        Config.get('responsemessage.SUPPLIER_RESPONSE.supplierCreateSuccess')
      )
    } catch (error) {
      console.log('error', error)
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

  public async show({ }: HttpContextContract) {
  }

  public async update({ }: HttpContextContract) {
  }

  public async destroy({ }: HttpContextContract) {
  }
}

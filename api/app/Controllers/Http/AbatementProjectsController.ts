import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { apiResponse } from 'App/helpers/response'
import Config from '@ioc:Adonis/Core/Config'
import CreateAbatementProjectValidator from 'App/Validators/AbatementProjects/CreateAbatementProjectValidator'
import AbatementProject from 'App/Models/AbatementProject'
import Organization from 'App/Models/Organization'

export default class AbatementProjectsController {
  public async index({ request, response }: HttpContextContract) {
    try {
      const queryParams = request.qs()

      const allProjectData: any = await AbatementProject.getAllProjects(queryParams);
      const isPaginated = request.input('perPage') && request.input('perPage') !== 'all'


      //;: Calculate total value of abatement
      let totalOfAbatement = 0
      let jsonFormat = JSON.parse(JSON.stringify(allProjectData))
      jsonFormat.data?.forEach((element) => {
        totalOfAbatement = parseFloat(
          totalOfAbatement + element.emission_reductions
        )
      })
      jsonFormat['totalOfAbatement'] = totalOfAbatement

      return apiResponse(
        response,
        true,
        200,
        jsonFormat,
        Config.get('responsemessage.COMMON_RESPONSE.getRequestSuccess'),
        isPaginated,
        true
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


  public async store({ request, response, auth }: HttpContextContract) {
    try {
      let requestData = request.all()
      await request.validate(CreateAbatementProjectValidator)

      var organizationData: any = await Organization.getOrganizationDetails(
        'id', requestData.organizationId
      )

      let createdProjectData = await AbatementProject.createNewProject(requestData, auth, organizationData)

      return apiResponse(
        response,
        true,
        201,
        createdProjectData,
        Config.get('responsemessage.ABATEMENT_PROJECT_RESPONSE.projectCreateSuccess')
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

  public async show({ response, params, auth }: HttpContextContract) {
    try {
      let projectData = await AbatementProject.getProjectDetails('id', params.id)

      return apiResponse(
        response,
        true,
        200,
        projectData,
        Config.get('responsemessage.COMMON_RESPONSE.getRequestSuccess')
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

  public async update({ }: HttpContextContract) {
  }

  public async destroy({ }: HttpContextContract) {
  }
}

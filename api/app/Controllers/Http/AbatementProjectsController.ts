import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { apiResponse } from 'App/helpers/response'
import Config from '@ioc:Adonis/Core/Config'
import CreateAbatementProjectValidator from 'App/Validators/AbatementProjects/CreateAbatementProjectValidator'
import UpdateAbatementProjectValidator from 'App/Validators/AbatementProjects/UpdateAbatementProjectValidator'
import AbatementProject from 'App/Models/AbatementProject'
import Organization from 'App/Models/Organization'
import { DateTime } from 'luxon'

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

  public async show({ response, params }: HttpContextContract) {
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

  public async update({ request, response }: HttpContextContract) {
    try {

      const projectData = await AbatementProject.getProjectDetails('id', request.param('id'))

      const payload = await request.validate(UpdateAbatementProjectValidator)

      const updateProject = await AbatementProject.updateProjectDetails(projectData, payload)

      return apiResponse(
        response,
        true,
        200,
        updateProject,
        Config.get('responsemessage.ABATEMENT_PROJECT_RESPONSE.projectUpdateSuccess')
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

  public async destroy({ request, response }: HttpContextContract) {
    try {
      const projectData = await AbatementProject.getProjectDetails('id', request.param('id'))

      if (projectData) {
        projectData.deletedAt = DateTime.local()
        await projectData.save()

        return apiResponse(response, true, 200, {}, Config.get('responsemessage.ABATEMENT_PROJECT_RESPONSE.projectDeleteSuccess'))
      } else {
        return apiResponse(response, false, 401, {}, Config.get('responsemessage.ABATEMENT_PROJECT_RESPONSE.projectNotFound'))
      }

    } catch (error) {
      return apiResponse(response, false, 404, {}, error.message)
    }
  }
}


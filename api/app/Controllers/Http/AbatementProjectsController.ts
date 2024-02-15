import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { apiResponse } from 'App/helpers/response'
import Config from '@ioc:Adonis/Core/Config'
import CreateAbatementProjectValidator from 'App/Validators/AbatementProjects/CreateAbatementProjectValidator'
import UpdateAbatementProjectValidator from 'App/Validators/AbatementProjects/UpdateAbatementProjectValidator'
import AbatementProject from 'App/Models/AbatementProject'
import Organization from 'App/Models/Organization'
import { DateTime } from 'luxon'
import User from 'App/Models/User'
import { sendMail } from 'App/helpers/sendEmail'



export default class AbatementProjectsController {
  public async index({ request, response, auth }: HttpContextContract) {
    try {
      const queryParams = request.qs()

      //:: Check organization id is same for auth user or not
      // const userFound = await User.getUserDetails('id', auth.user?.id)
      // let organizationIds = (await userFound.organizations).map((item) => item.id)
      // if (queryParams.organizationId && !organizationIds.includes(queryParams.organizationId)) {
      //   return apiResponse(
      //     response,
      //     false,
      //     403,
      //     {},
      //     "The provided organization ID does not belongs to you."
      //   )
      // }

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

      //:: Check organization id is same for auth user or not
      const userFound = await User.getUserDetails('id', auth.user?.id)
      let organizationIds = (await userFound.organizations).map((item) => item.id)
      if (requestData.organizationId && !organizationIds.includes(requestData.organizationId)) {
        return apiResponse(
          response,
          false,
          403,
          {},
          "The provided organization ID does not belongs to you."
        )
      }


      var organizationData: any = await Organization.getOrganizationDetails(
        'id', requestData.organizationId ? requestData.organizationId : organizationIds[0]
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

  public async show({ response, params, bouncer }: HttpContextContract) {
    try {
      let projectData = await AbatementProject.getProjectDetails('id', params.id)

      //:: Authorization (auth user can access their project data only)
      await bouncer.with('AbatementProjectsPolicy').authorize('show', projectData.toJSON())

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

  public async update({ request, response, bouncer }: HttpContextContract) {
    try {

      const projectData = await AbatementProject.getProjectDetails('id', request.param('id'))

      let projectPreviousStatus = projectData.toJSON().status;

      //:: Authorization (auth user can update their project data only)
      await bouncer.with('AbatementProjectsPolicy').authorize('update', projectData.toJSON())

      const payload = await request.validate(UpdateAbatementProjectValidator)

      const updateProject = await (await AbatementProject.updateProjectDetails(projectData, payload)).toJSON()

      const emailData = {
        projectName: updateProject.name,
        updatedStatus: updateProject.status == 1 ? 'active' : (updateProject.status == 0 ? 'proposed' : 'completed'),
        previousStatus: projectPreviousStatus == 1 ? 'active' : (projectPreviousStatus == 0 ? 'proposed' : 'completed'),
        organizationName: updateProject.organization?.company_name,
        userName: updateProject.proposedSupplier?.name
      }

      if (updateProject.status !== projectPreviousStatus) {
        await sendMail(
          updateProject.proposedSupplier?.email,
          `${emailData.organizationName} has updated the project status`,
          'emails/update_project_status',
          emailData
        )
      }

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

  public async destroy({ request, response, bouncer }: HttpContextContract) {
    try {
      const projectData = await AbatementProject.getProjectDetails('id', request.param('id'))

      //:: Authorization (auth user can update their project data only)
      await bouncer.with('AbatementProjectsPolicy').authorize('delete', projectData.toJSON())

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


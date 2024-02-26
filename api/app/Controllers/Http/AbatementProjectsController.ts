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
import SupplierOrganization from 'App/Models/SupplierOrganization'



export default class AbatementProjectsController {
  /**
 * Gets all abatement projects. 
 * Checks if the organization ID in the query matches the auth user's organization.
 * Calculates and returns the total abatement amount.
 * Returns paginated response if perPage is set in query.
*/
  public async index({ request, response, auth }: HttpContextContract) {
    try {
      const queryParams = request.qs()

      //:: Check organization id is same for auth user or not
      const userFound = await User.getUserDetails('id', auth.user?.id)
      let organizationIds = (await userFound.organizations).map((item) => item.id)
      let supplierOrganizationData: any = {}


      supplierOrganizationData = await (await SupplierOrganization.query()
        .where('supplier_organization_id', organizationIds[0])
        .first())?.toJSON()

      // if (queryParams.organizationId && !organizationIds.includes(queryParams.organizationId) && supplierOrganizationData == undefined) {
      //   return apiResponse(
      //     response,
      //     false,
      //     403,
      //     {},
      //     "The provided organization ID does not belongs to you."
      //   )
      // }

      const allProjectData: any = await AbatementProject.getAllProjects(queryParams, supplierOrganizationData);
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


  /**
 * Creates a new abatement project.
 * 
 * Validates the request data against the validator. 
 * Checks if the organization ID matches the authenticated user's organizations.
 * Gets the organization data for the provided or default organization ID.
 * Calls the AbatementProject model to create the new project.
 * Handles validation errors and other exceptions.
*/
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

  /**
 * Retrieves a single abatement project by ID.
 * @param params - The route parameters containing the project ID.
 * Authorizes the user can only access their own projects.
 */
  public async show({ response, params }: HttpContextContract) {
    try {
      let projectData = await AbatementProject.getProjectDetails('id', params.id)

      //:: Authorization (auth user can access their project data only)
      // await bouncer.with('AbatementProjectsPolicy').authorize('show', projectData)

      return apiResponse(
        response,
        true,
        200,
        projectData,
        Config.get('responsemessage.COMMON_RESPONSE.getRequestSuccess'),
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

  /**
 * Updates an abatement project.
 * 
 * Validates the request payload against the update project schema. 
 * Fetches the project by ID to get previous status.
 * Authorizes the user can only update their own project.
 * Updates the project details. 
 * Sends email notification if status changed.
 * Returns API response with updated project data.
*/
  public async update({ request, response }: HttpContextContract) {
    try {

      const projectData = await AbatementProject.getProjectData('id', request.param('id'))

      let projectPreviousStatus = projectData.toJSON().status;

      //:: Authorization (auth user can update their project data only)
      // await bouncer.with('AbatementProjectsPolicy').authorize('update', projectData.toJSON())

      const payload = await request.validate(UpdateAbatementProjectValidator)

      const updateProject = await AbatementProject.updateProjectDetails(projectData, payload)

      const emailData = {
        projectName: updateProject.name,
        updatedStatus: updateProject.status == 1 ? 'active' : (updateProject.status == 0 ? 'proposed' : 'completed'),
        previousStatus: projectPreviousStatus == 1 ? 'active' : (projectPreviousStatus == 0 ? 'proposed' : 'completed'),
        organizationName: updateProject.organization?.company_name,
        userName: updateProject.proposed_type == "supplier" ? updateProject.proposedSupplier?.name :
          `${updateProject.proposedOrganization?.users[0]?.firstName} ${updateProject.proposedOrganization?.users[0]?.lastName}`,
        userMail: updateProject.proposed_type == "supplier" ? updateProject.proposedSupplier?.email :
          `${updateProject.proposedOrganization?.users[0]?.email}`
      }

      if (updateProject.status !== projectPreviousStatus) {
        await sendMail(
          emailData.userMail,
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

  /**
 * Deletes an abatement project by ID.
 * 
 * Authorizes the request using the AbatementProjectsPolicy. 
 * Updates the deletedAt timestamp if the project exists.
 * Returns a success response with no data if deleted, else returns a 404.
 */
  public async destroy({ request, response }: HttpContextContract) {
    try {
      const projectData = await AbatementProject.getProjectData('id', request.param('id'))

      //:: Authorization (auth user can update their project data only)
      // await bouncer.with('AbatementProjectsPolicy').authorize('delete', projectData.toJSON())

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


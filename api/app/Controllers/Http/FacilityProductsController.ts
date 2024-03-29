import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { apiResponse } from 'App/helpers/response'
import Config from '@ioc:Adonis/Core/Config'
import AddMultipleFacilityProductsValidator from 'App/Validators/FacilityProduct/AddMultipleFacilityProductsValidator'
import FacilityProduct from 'App/Models/FacilityProduct'
import FacilityEmission from 'App/Models/FacilityEmission'
import UpdateMultipleFacilityProductValidator from 'App/Validators/FacilityProduct/UpdateMultipleFacilityProductValidator'
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'

export default class FacilityProductsController {
  /**
 * Handles GET request to retrieve all facility products.
 * 
 * Query parameters can be passed to filter/paginate results.
 * 
 * Returns paginated JSON response with facility products data.
 * Handles errors and returns error response if request fails.
 */
  public async index({ request, response }: HttpContextContract) {
    try {
      const queryParams = request.qs()

      const facilityProducts = await FacilityProduct.getAllFacilityProducts(queryParams)

      const isPaginated = !request.input('per_page') || request.input('per_page') !== 'all'

      return apiResponse(
        response,
        true,
        200,
        facilityProducts,
        Config.get('responsemessage.ORGANIZATION_FACILITY_RESPONSE.dataFetchSuccess'),
        isPaginated
      )
    } catch (error) {
      return apiResponse(response, false, 400, {}, error.messages ? error.messages : error.message)
    }
  }

  /**
 * Handles POST request to create multiple facility products for a facility emission.
 * 
 * Validates request data against schema. Checks for duplicate product names for the facility emission.
 * Creates facility products and links to facility emission. 
 * 
 * Returns API response with created facility products data on success,
 * validation errors or error response on failure.
 */
  public async store({ request, response }: HttpContextContract) {
    try {
      let requestData = request.all()

      // validate facility details
      await request.validate(AddMultipleFacilityProductsValidator)

      var emissionData = await FacilityEmission.getFacilityEmissionData(
        'id',
        requestData.facilityEmissionId
      )

      // Get the FacilityEmission data with loaded relationships with OrganizationFacility
      const emissionDataWithFacility = await FacilityEmission.query()
        .preload('OrganizationFacility')
        .where('id', requestData.facilityEmissionId)
        .first()

      const organizationId = emissionDataWithFacility?.OrganizationFacility?.organization_id
      const productNames = requestData.facilityProducts.map((product) => product.name)

      const existingProducts = await FacilityProduct.query()
        .where('facilityEmissionId', requestData.facilityEmissionId)
        .whereIn('name', productNames)
        .whereHas('FacilityEmission', (query) => {
          if (organizationId) {
            query.whereHas('OrganizationFacility', (orgQuery) => {
              orgQuery.where('organization_id', organizationId)
            })
          }
        })
        .first()

      if (existingProducts) {
        return apiResponse(
          response,
          false,
          422,
          {
            errors: [
              {
                field: 'name',
                message: Config.get(
                  'responsemessage.ORGANIZATION_FACILITY_RESPONSE.facilityProductNameAlreadyExists'
                ),
              },
            ],
          },
          Config.get('responsemessage.COMMON_RESPONSE.validation_failed')
        )
      }

      // Assuming payload is an array of product data
      const createdFacilityProducts = await FacilityProduct.createFacilityProducts(
        emissionData,
        requestData
      )

      return apiResponse(
        response,
        true,
        201,
        createdFacilityProducts,
        Config.get('responsemessage.ORGANIZATION_FACILITY_RESPONSE.createFacilityProductSuccess')
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
 * Update multiple facility products for a facility emission.
 * 
 * Validates the request data against the update facility product validator.
 * Checks for duplicate product names within the organization.
 * Updates existing products or creates new ones in a database transaction.
 * Returns the updated facility products.
*/
  public async updateFacilityMultipleProducts({ request, response, bouncer }) {
    //::Initialize database transaction
    const trx = await Database.transaction()

    try {
      let requestData = request.all()
      console.log('requestData', requestData)
      const facilityProducts = requestData.facilityProducts || []
      const facilityEmissionId = requestData.facilityEmissionId

      const facilityEmissionData = await FacilityEmission.getFacilityEmissionData(
        'id',
        requestData.facilityEmissionId
      )

      //:: Authorization (auth user can update their facility's emissions data only)
      await bouncer.with('FacilityEmissionPolicy').authorize('update', facilityEmissionData)

      await request.validate(UpdateMultipleFacilityProductValidator)

      // Get the FacilityEmission data with loaded relationships with OrganizationFacility
      const emissionDataWithFacility = await FacilityEmission.query()
        .preload('OrganizationFacility')
        .where('id', requestData.facilityEmissionId)
        .first()

      const organizationId = emissionDataWithFacility?.OrganizationFacility?.organization_id

      // Check uniqueness for each product (updated and newly added)
      for (const product of facilityProducts) {
        if (product.name) {
          const existingProducts = await FacilityProduct.query()
            .where('facilityEmissionId', facilityEmissionId)
            .where((query) => {
              if (organizationId) {
                query.whereHas('FacilityEmission', (orgQuery) => {
                  orgQuery.whereHas('OrganizationFacility', (orgFacQuery) => {
                    orgFacQuery.where('organization_id', organizationId)
                  })
                })
              }
              if (product.id) {
                query.where('id', '!=', product.id) // Exclude the current product being updated
              }
              query.where('name', product.name) // Check if the name matches any existing product
            })
            .first()

          if (existingProducts) {
            return apiResponse(
              response,
              false,
              422,
              {
                errors: [
                  {
                    field: 'name',
                    message: Config.get(
                      'responsemessage.ORGANIZATION_FACILITY_RESPONSE.facilityProductNameAlreadyExists'
                    ),
                  },
                ],
              },
              Config.get('responsemessage.COMMON_RESPONSE.validation_failed')
            )
          }
        }
      }
      const updateFacilityProducts = await FacilityProduct.updateOrCreateFacilityProducts(
        facilityEmissionData,
        requestData,
        trx
      )

      //::commit database transaction
      await trx.commit()

      return apiResponse(
        response,
        true,
        200,
        updateFacilityProducts,
        Config.get('responsemessage.ORGANIZATION_FACILITY_RESPONSE.updateFacilityProductSuccess')
      )
    } catch (error) {
      //::database transaction rollback if transaction failed
      await trx.rollback()

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
 * Calculates the carbon emission for a facility emission based on the provided facility emission ID.
 * 
 * Gets the facility emission data for the provided ID. 
 * Calls the FacilityProduct model's calculateCarbonEmission method to perform the calculation.
 * 
 * Returns the calculated carbon emission in the response.
*/
  public async calculateEqualityCarbonEmission({ request, response }) {
    try {
      const queryParams = request.qs()

      const facilityEmissionData = await FacilityEmission.getFacilityEmissionData(
        'id',
        queryParams.facilityEmissionId
      )

      const calculatedEmission = await FacilityProduct.calculateCarbonEmission(facilityEmissionData)

      return apiResponse(
        response,
        true,
        200,
        calculatedEmission,
        Config.get('responsemessage.ORGANIZATION_FACILITY_RESPONSE.equalityCarbonEmissionSuccess')
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
 * Gets all product names for the given organization.
 * 
 * Checks that the given organization ID matches the auth user's organization. 
 * Calls the FacilityProduct model to get all product names for the given organization.
 * 
 * Returns the product names in the response.
*/
  public async getAllProductNames({ response, request, auth }: HttpContextContract) {
    try {
      const queryParams = request.qs()

      //:: Check organization id is same for auth user or not
      const userFound = await User.getUserDetails('id', auth.user?.id)
      let organizationIds = (await userFound.organizations).map((item) => item.id)
      if (queryParams.organization_id && !organizationIds.includes(queryParams.organization_id)) {
        return apiResponse(
          response,
          false,
          403,
          {},
          'The provided organization ID does not belongs to you.'
        )
      }

      const allProductNamesOfFacility = await FacilityProduct.getAllProductNames(queryParams)
      return apiResponse(
        response,
        true,
        200,
        allProductNamesOfFacility,
        Config.get('responsemessage.COMMON_RESPONSE.getRequestSuccess'),
        false
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
}

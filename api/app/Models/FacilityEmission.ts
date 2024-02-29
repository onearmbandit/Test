import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  HasMany,
  hasMany,
  hasOne,
  HasOne,
  computed,
} from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from 'uuid'
import { ParsedQs } from 'qs'
import OrganizationFacility from './OrganizationFacility'
import FacilityProduct from './FacilityProduct'
import FacilityEqualityAttribute from './FacilityEqualityAttribute'

export default class FacilityEmission extends BaseModel {
  public serializeExtras = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public organizationFacilityId: string

  @column.date()
  public reportingPeriodFrom: DateTime

  @column.date()
  public reportingPeriodTo: DateTime

  @column({ columnName: 'scope_1_total_emission' })
  public scope1TotalEmission: number

  @column({ columnName: 'scope_2_total_emission' })
  public scope2TotalEmission: number

  @column({ columnName: 'scope_3_total_emission' })
  public scope3TotalEmission: number

  @column.dateTime({ columnName: 'deleted_at' })
  public deletedAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Computed property definition
  @computed()
  public get emission_sum() {
    return this.scope1TotalEmission + this.scope2TotalEmission + this.scope3TotalEmission
  }

  //::_____Relationships Start_____:://

  @belongsTo(() => OrganizationFacility, {
    foreignKey: 'organizationFacilityId',
  })
  public OrganizationFacility: BelongsTo<typeof OrganizationFacility>

  @hasMany(() => FacilityProduct, {
    foreignKey: 'facilityEmissionId', // defaults to userId
  })
  public FacilityProducts: HasMany<typeof FacilityProduct>

  @hasOne(() => FacilityEqualityAttribute, {
    foreignKey: 'facilityEmissionId', // defaults to userId
  })
  public FacilityEqualityAttribute: HasOne<typeof FacilityEqualityAttribute>

  //::_____Relationships End_____:://

  /**
 * Gets all facility emissions records filtered by the provided query parameters.
 *
 * Accepts pagination, sorting and filtering params.
 * Returns a paginated result of facility emission records matching the criteria.
 */
  public static async getAllFacilityEmissions(queryParams: ParsedQs) {
    const perPage = queryParams.per_page ? parseInt(queryParams.per_page as string, 10) : 8
    const page = queryParams.page ? parseInt(queryParams.page as string, 10) : 1
    // const order = queryParams.order ? queryParams.order.toString() : 'desc'
    // const sort = queryParams.sort ? queryParams.sort.toString() : 'created_at'
    const organizationFacilityId = queryParams.organization_facility_id
      ? queryParams.organization_facility_id.toString()
      : ''

    const organizationId = queryParams.organization_id ? queryParams.organization_id.toString() : ''

    let query = this.query().whereNull('deleted_at') // Exclude soft-deleted records;

    if (organizationFacilityId) {
      query = query.where('organization_facility_id', organizationFacilityId)
    } else if (organizationId) {
      query = query.whereHas('OrganizationFacility', (orgQuery) => {
        orgQuery.where('organization_id', organizationId)
      }).groupBy('reportingPeriodFrom', 'reportingPeriodTo')
        .select('reportingPeriodFrom', 'reportingPeriodTo');
    }

    // query = query.orderBy(sort, order)

    const facilityEmissions = await query.paginate(page, perPage)

    return facilityEmissions
  }

  /**
 * Creates a new reporting period record.
 *
 * @param requestData - The request data containing the details for the new reporting period.
 * @returns The newly created reporting period record.
 */
  public static async createReportingPeriod(requestData) {
    const reportingPeriodData = await this.create({
      id: uuidv4(),
      organizationFacilityId: requestData.organizationFacilityId,
      reportingPeriodFrom: DateTime.fromJSDate(new Date(requestData.reportingPeriodFrom)),
      reportingPeriodTo: DateTime.fromJSDate(new Date(requestData.reportingPeriodTo)),
    })

    return reportingPeriodData
  }

  /**
 * Gets facility emission data by the provided field and value.
 *
 * Queries for the facility emission record matching the provided
 * field and value. Returns the facility emission details if found.
*/
  public static async getFacilityEmissionData(field, value) {
    const facilityDetails = await this.query()
      .where(field, value)
      .whereNull('deleted_at') // Exclude soft-deleted records
      .preload('FacilityEqualityAttribute')
      .preload('FacilityProducts', (query) => {
        query.whereNull('deleted_at')
      })
      .preload('FacilityEqualityAttribute')
      .firstOrFail()

    return facilityDetails
  }

  /**
 * Updates the facility emission data for the provided facility emission record
 * with the new data in the request. Updates the reporting period fields if they exist in the
 * request. Also updates the emission total fields (scope1TotalEmission,
 * scope2TotalEmission, scope3TotalEmission) if they exist. Saves the changes to the database.
 *
 * @param {Object} facilityEmission - The facility emission record to update
 * @param {Object} requestData - The request data containing the fields to update
 * @returns {Object} The updated facility emission record
*/
  public static async updateFacilityEmissionData(FacilityEmissionData, requestData) {
    const facilityEmission = await this.findOrFail(FacilityEmissionData.id)

    // Update the reporting period fields based on the requestData if they exist
    if (requestData.reportingPeriodFrom) {
      facilityEmission.reportingPeriodFrom = DateTime.fromJSDate(
        new Date(requestData.reportingPeriodFrom)
      )
    }
    if (requestData.reportingPeriodTo) {
      facilityEmission.reportingPeriodTo = DateTime.fromJSDate(
        new Date(requestData.reportingPeriodTo)
      )
    }

    // Add three more fields for update if they exist in the requestData
    if (requestData.scope1TotalEmission) {
      facilityEmission.scope1TotalEmission = requestData.scope1TotalEmission
    }
    if (requestData.scope2TotalEmission) {
      facilityEmission.scope2TotalEmission = requestData.scope2TotalEmission
    }
    if (requestData.scope3TotalEmission) {
      facilityEmission.scope3TotalEmission = requestData.scope3TotalEmission
    }
    // Save the changes to the database
    await facilityEmission.save()

    return facilityEmission
  }

  /**
 * Retrieves dashboard data for facilities in the given organization based on the provided query parameters.
 *
 * Sums the total emissions by scope for each facility. Also calculates the totals for all facilities.
 *
 * @param queryParams - Object containing reportingPeriodFrom and reportingPeriodTo filters
 * @param organizationId - ID of the organization to get facilities for
 * @returns Object containing final results array and total emissions by scope sums
*/
  public static async getFacilitiesDashboardData(queryParams, organizationId) {
    const reportingPeriodFrom = queryParams.reportingPeriodFrom
      ? queryParams.reportingPeriodFrom.toString()
      : ''
    const reportingPeriodTo = queryParams.reportingPeriodTo
      ? queryParams.reportingPeriodTo.toString()
      : ''

    let query = this.query()
      .whereNull('deleted_at')
      .whereHas('OrganizationFacility', (builder) => {
        builder.where('organization_id', organizationId) // Customize this based on your condition
      })
      .preload('OrganizationFacility')

    if (reportingPeriodFrom && reportingPeriodTo) {
      query = query
        .whereBetween('reportingPeriodFrom', [reportingPeriodFrom, reportingPeriodTo])
        .orWhereBetween('reportingPeriodTo', [reportingPeriodFrom, reportingPeriodTo])
    }

    // Check if the query is empty before proceeding with calculations
    const queryResults = await query.whereHas('OrganizationFacility', (builder) => {
      builder.where('organization_id', organizationId)
    })

    if (queryResults.length === 0) {
      return {
        finalResults: [],
        totalScope1EmissionForAllFacilities: 0,
        totalScope2EmissionForAllFacilities: 0,
        totalScope3EmissionForAllFacilities: 0,
        totalEmission: 0,
      }
    }

    const summedResults = {}
    let totalScope1ForAllFacilities = 0
    let totalScope2ForAllFacilities = 0
    let totalScope3ForAllFacilities = 0

      ; (await query).forEach((item) => {
        const facilityId = item.organizationFacilityId

        summedResults[facilityId] ||= {
          facilityName: item.OrganizationFacility?.name,
          totalScope1: 0,
          totalScope2: 0,
          totalScope3: 0,
        }

        summedResults[facilityId].totalScope1 += item.scope1TotalEmission
        summedResults[facilityId].totalScope2 += item.scope2TotalEmission
        summedResults[facilityId].totalScope3 += item.scope3TotalEmission

        totalScope1ForAllFacilities += item.scope1TotalEmission
        totalScope2ForAllFacilities += item.scope2TotalEmission
        totalScope3ForAllFacilities += item.scope3TotalEmission
      })

    const finalResults = Object.keys(summedResults).map((facilityId) => ({
      facilityOrganizationId: facilityId,
      facilityName: summedResults[facilityId].facilityName,
      totalScope1TotalEmission: summedResults[facilityId].totalScope1,
      totalScope2TotalEmission: summedResults[facilityId].totalScope2,
      totalScope3TotalEmission: summedResults[facilityId].totalScope3,
    }))

    const finalResultWithTotals = {
      finalResults,
      totalScope1EmissionForAllFacilities: totalScope1ForAllFacilities,
      totalScope2EmissionForAllFacilities: totalScope2ForAllFacilities,
      totalScope3EmissionForAllFacilities: totalScope3ForAllFacilities,
      totalEmission:
        totalScope1ForAllFacilities + totalScope2ForAllFacilities + totalScope3ForAllFacilities,
    }

    return finalResultWithTotals
  }
}

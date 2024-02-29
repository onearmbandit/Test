import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo, belongsTo, HasMany, hasMany, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import Organization from './Organization'
import { v4 as uuidv4 } from 'uuid'
import { ParsedQs } from 'qs'
import FacilityEmission from './FacilityEmission'

export default class OrganizationFacility extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public organization_id: string

  @column()
  public name: string

  @column()
  public address: string

  @column.dateTime({ columnName: 'deleted_at' })
  public deleted_at: DateTime

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  @belongsTo(() => Organization, {
    localKey: 'organizationsId',
  })
  public organization: BelongsTo<typeof Organization>

  @hasMany(() => FacilityEmission, {
    foreignKey: 'organizationFacilityId', // defaults to userId
  })
  public facilityEmission: HasMany<typeof FacilityEmission>



  /**
 * Creates a new OrganizationFacility record with the provided facilityData and organization ID.
 * Generates a new UUID for the id field and merges it into the facilityData.
 * Defaults the organization_id to the provided organizationIds if not already set in facilityData.
 */
  public static async createFacility(facilityData, organizationIds) {
    // Generate a new UUID for the id field
    const id = uuidv4()

    // Merge the generated id with the facilityData
    const dataWithId = {
      ...facilityData,
      id,
      organization_id: facilityData.organization_id
        ? facilityData.organization_id
        : organizationIds,
    }

    const result = await OrganizationFacility.create(dataWithId)

    return result
  }

  /**
 * Gets all OrganizationFacility records.
 * Handles pagination, sorting, filtering, and eager loading of relationships.
 */
  public static async getAllFacilities(queryParams: ParsedQs) {
    let organizationFacilities: any = {}

    const perPage = queryParams.per_page ? parseInt(queryParams.per_page as string, 10) : 8
    const page = queryParams.page ? parseInt(queryParams.page as string, 10) : 1
    const order = queryParams.order ? queryParams.order.toString() : 'desc'
    const sort = queryParams.sort ? queryParams.sort.toString() : 'created_at'
    let includes: string[] = queryParams.include ? queryParams.include.split(',') : []
    const organizationId = queryParams.organization_id ? queryParams.organization_id.toString() : ''

    let query = this.query().whereNull('deleted_at') // Exclude soft-deleted records;

    if (organizationId) {
      query = query.where('organization_id', organizationId)
        .preload('facilityEmission', (facilityEmissionQuery) => {
          facilityEmissionQuery.whereNull('deleted_at')
        })
    }

    query = query.orderBy(sort, order)

    //::Include Relationship
    if (includes.length > 0) {
      includes.forEach((include: any) => query.preload(include.trim()))
    }

    //:: Pagination handling
    if (queryParams.per_page && queryParams.per_page !== 'all') {
      organizationFacilities = await query.paginate(page, perPage)
    } else {
      organizationFacilities = await query
    }

    return organizationFacilities
  }

  /**
 * Gets an OrganizationFacility record by the provided field and value.
 * Handles eager loading of relationships.
 */
  public static async getOrganizationFacilityData(field, value) {
    const facilityDetails = await OrganizationFacility.query()
      .where(field, value)
      .whereNull('deleted_at') // Exclude soft-deleted records
      .preload('facilityEmission', (facilityEmissionQuery) => {
        facilityEmissionQuery.whereNull('deleted_at')
        facilityEmissionQuery.preload('FacilityProducts')
      })
      .firstOrFail()
    return facilityDetails
  }

  /**
 * Updates an OrganizationFacility record with the provided data.
 * Merges the provided data into the existing OrganizationFacility record.
 * Handles saving the updated record to the database.
*/
  public static async updateOrganizationFacility(
    organizationFacilityData: OrganizationFacility,
    data: {
      name: string | undefined
      address: string | undefined
    }
  ) {
    await organizationFacilityData.merge(data).save()
    return organizationFacilityData
  }
}

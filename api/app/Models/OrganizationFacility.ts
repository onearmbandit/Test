import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo, belongsTo, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Organization from './Organization'
import { v4 as uuidv4 } from 'uuid';
import { ParsedQs } from 'qs';
import FacilityEmission from './FacilityEmission';

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


  public static async createFacility(facilityData,organizationIds) {

    // Generate a new UUID for the id field
    const id = uuidv4();

    // Merge the generated id with the facilityData
    const dataWithId = {
      ...facilityData, id,
      organization_id: facilityData.organization_id ? facilityData.organization_id : organizationIds
    };

    const result = await OrganizationFacility.create(dataWithId)

    return result;
  }


  public static async getAllFacilities(queryParams: ParsedQs) {
    let organizationFacilities: any = {}

    const perPage = queryParams.per_page ? parseInt(queryParams.per_page as string, 10) : 8;
    const page = queryParams.page ? parseInt(queryParams.page as string, 10) : 1;
    const order = queryParams.order ? queryParams.order.toString() : 'desc';
    const sort = queryParams.sort ? queryParams.sort.toString() : 'created_at';
    const organizationId = queryParams.organization_id ? queryParams.organization_id.toString() : '';

    let query = this.query().whereNull('deleted_at') // Exclude soft-deleted records;

    if (organizationId) {
      query = query.where('organization_id', organizationId);
    }

    query = query.orderBy(sort, order);

    //:: Pagination handling
    if (queryParams.per_page && queryParams.per_page !== 'all') {
      organizationFacilities = await query.paginate(page, perPage)
    }
    else {
      organizationFacilities = await query
    }


    return organizationFacilities
  }

  public static async getOrganizationFacilityData(field, value) {

    const facilityDetails = await OrganizationFacility.query()
      .where(field, value)
      .whereNull('deleted_at') // Exclude soft-deleted records
      .preload('facilityEmission', (facilityEmissionQuery) => {
        facilityEmissionQuery.preload('FacilityProducts');
      })
      .firstOrFail();
    return facilityDetails;
  }

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

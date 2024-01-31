import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import Organization from './Organization'
import { v4 as uuidv4 } from 'uuid';
import { ParsedQs } from 'qs';

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


  @belongsTo(() => Organization,{
    localKey: 'organizations_id',
  })
  public organization: BelongsTo<typeof Organization>


  public static async createFacility(facilityData) {

    // Generate a new UUID for the id field
    const id = uuidv4();

    // Merge the generated id with the facilityData
    const dataWithId = { ...facilityData, id };

    const result = await OrganizationFacility.create(dataWithId)

    return result;
  }


  public static async getAllFacilities(queryParams: ParsedQs) {
    const perPage = queryParams.per_page ? parseInt(queryParams.per_page as string, 10) : 8;
    const page = queryParams.page ? parseInt(queryParams.page as string, 10) : 1;
    const order = queryParams.order ? queryParams.order.toString() : 'desc';
    const sort = queryParams.sort ? queryParams.sort.toString() : 'created_at';
    const organizationId = queryParams.organizationId ? queryParams.organizationId.toString() : '';

    let query = this.query().whereNull('deleted_at') // Exclude soft-deleted records;

    if (organizationId) {
      query = query.where('organization_id', organizationId);
    }

    query = query.orderBy(sort, order);

    const organizationFacilities = await query.paginate(page, perPage);

    return organizationFacilities
  }

  public static async getOrganizationFacilityData(field, value) {

    const facilityDetails = await OrganizationFacility.query()
    .where(field, value)
    .whereNull('deleted_at') // Exclude soft-deleted records
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

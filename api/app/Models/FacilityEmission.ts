import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from 'uuid';
import { ParsedQs } from 'qs';
import OrganizationFacility from './OrganizationFacility';


export default class FacilityEmission extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public organizationFacilityId: string

  @column.date()
  public reportingPeriodFrom: DateTime

  @column.date()
  public reportingPeriodTo: DateTime

  @column()
  public scope1TotalEmission: number

  @column()
  public scope2TotalEmission: number

  @column()
  public scope3TotalEmission: number

  @column.dateTime({ columnName: 'deleted_at' })
  public deletedAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  //::_____Relationships Start_____:://

  @belongsTo(() => OrganizationFacility, {
    foreignKey: 'organization_facility_id',
  })
  public OrganizationFacility: BelongsTo<typeof OrganizationFacility>

  //::_____Relationships End_____:://

  public static async getAllFacilityEmissions(queryParams: ParsedQs) {
    const perPage = queryParams.per_page ? parseInt(queryParams.per_page as string, 10) : 8;
    const page = queryParams.page ? parseInt(queryParams.page as string, 10) : 1;
    const order = queryParams.order ? queryParams.order.toString() : 'desc';
    const sort = queryParams.sort ? queryParams.sort.toString() : 'created_at';
    const organizationFacilityId = queryParams.organizationFacilityId ? queryParams.organizationFacilityId.toString() : '';

    let query = this.query().whereNull('deleted_at') // Exclude soft-deleted records;

    if (organizationFacilityId) {
      query = query.where('organization_facility_id', organizationFacilityId);
    }

    query = query.orderBy(sort, order);

    const facilityEmissions = await query.paginate(page, perPage);

    return facilityEmissions
  }


  public static async createReportingPeriod(requestData) {

    const reportingPeriodData = await this.create({
      id: uuidv4(),
      organizationFacilityId: requestData.organizationFacilityId,
      reportingPeriodFrom: DateTime.fromJSDate(new Date(requestData.reportingPeriodFrom)),
      reportingPeriodTo: DateTime.fromJSDate(new Date(requestData.reportingPeriodTo))
    })

    return reportingPeriodData
  }

  public static async getFacilityEmissionData(field, value) {

    const facilityDetails = await this.query()
    .where(field, value)
    .whereNull('deleted_at') // Exclude soft-deleted records
    .firstOrFail();
    return facilityDetails;
  }

  public static async updateFacilityEmissionData(FacilityEmissionData, requestData) {
    const facilityEmission = await this.findOrFail(FacilityEmissionData.id);

    // Update the reporting period fields based on the requestData
    facilityEmission.reportingPeriodFrom = DateTime.fromJSDate(new Date(requestData.reportingPeriodFrom));
    facilityEmission.reportingPeriodTo = DateTime.fromJSDate(new Date(requestData.reportingPeriodTo));

    // Save the changes to the database
    await facilityEmission.save();

    return facilityEmission;
  }
}

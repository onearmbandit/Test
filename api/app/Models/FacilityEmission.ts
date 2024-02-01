import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from 'uuid';
import { ParsedQs } from 'qs';
import OrganizationFacility from './OrganizationFacility';
import FacilityProduct from './FacilityProduct';


export default class FacilityEmission extends BaseModel {
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

  //::_____Relationships Start_____:://

  @belongsTo(() => OrganizationFacility, {
    foreignKey: 'organizationFacilityId',
  })
  public OrganizationFacility: BelongsTo<typeof OrganizationFacility>

  @hasMany(() => FacilityProduct, {
    foreignKey: 'facilityEmissionId', // defaults to userId
  })
  public FacilityProducts: HasMany<typeof FacilityProduct>

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
      .preload('FacilityProducts')
      .firstOrFail();
    return facilityDetails;
  }

  public static async updateFacilityEmissionData(FacilityEmissionData, requestData) {
    const facilityEmission = await this.findOrFail(FacilityEmissionData.id);

    // Update the reporting period fields based on the requestData if they exist
    if (requestData.reportingPeriodFrom) {
      facilityEmission.reportingPeriodFrom = DateTime.fromJSDate(new Date(requestData.reportingPeriodFrom));
    }
    if (requestData.reportingPeriodTo) {
      facilityEmission.reportingPeriodTo = DateTime.fromJSDate(new Date(requestData.reportingPeriodTo));
    }

    // Add three more fields for update if they exist in the requestData
    if (requestData.scope1TotalEmission) {
      facilityEmission.scope1TotalEmission = requestData.scope1TotalEmission;
    }
    if (requestData.scope2TotalEmission) {
      facilityEmission.scope2TotalEmission = requestData.scope2TotalEmission;
    }
    if (requestData.scope3TotalEmission) {
      facilityEmission.scope3TotalEmission = requestData.scope3TotalEmission;
    }
    // Save the changes to the database
    await facilityEmission.save();

    return facilityEmission;
  }
}

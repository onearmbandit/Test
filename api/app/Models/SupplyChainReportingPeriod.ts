import { DateTime } from 'luxon'
import {
  BaseModel, column, belongsTo, BelongsTo,
  hasMany, HasMany
} from '@ioc:Adonis/Lucid/Orm'
import Organization from './Organization'
import Supplier from './Supplier'
import { v4 as uuidv4 } from 'uuid';
import { ParsedQs } from 'qs';


export default class SupplyChainReportingPeriod extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public organizationId: string

  @column.date()
  public reportingPeriodFrom: DateTime

  @column.date()
  public reportingPeriodTo: DateTime

  @column.dateTime()
  public deletedAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime


  //::_____Relationships Start_____:://

  @belongsTo(() => Organization, {
    foreignKey: 'organizationId',
  })
  public organization: BelongsTo<typeof Organization>


  @hasMany(() => Supplier, {
    foreignKey: 'supplyChainReportingPeriodId',
  })
  public supplier: HasMany<typeof Supplier>


  //::_____Relationships End_____:://


  /**
 * Gets all reporting periods for an organization with pagination.
 * 
 * @param queryParams - The query string parameters.
 * @returns The paginated reporting periods for the organization.
*/
  public static async getAllReportingPeriod(queryParams: ParsedQs) {
    let organizationReportingPeriods: any = {}

    const perPage = queryParams.per_page ? parseInt(queryParams.per_page as string, 10) : 10;
    const page = queryParams.page ? parseInt(queryParams.page as string, 10) : 1;
    const order = queryParams.order ? queryParams.order.toString() : 'desc';
    const sort = queryParams.sort ? queryParams.sort.toString() : 'created_at';
    const organizationId = queryParams.organizationId ? queryParams.organizationId.toString() : '';

    let query = this.query().whereNull('deleted_at') // Exclude soft-deleted records;

    if (organizationId) {
      query = query.where('organization_id', organizationId);
    }

    query = query.orderBy(sort, order);

    //:: Pagination handling
    if (queryParams.per_page && queryParams.per_page !== 'all') {
      organizationReportingPeriods = await query.preload('supplier').paginate(page, perPage)
    }
    else {
      organizationReportingPeriods = await query.preload('supplier')
    }

    return organizationReportingPeriods
  }


  /**
 * Creates a new reporting period for the given organization.
 *
 * @param requestData - The request data containing the organization ID and reporting period dates. 
 * @param organizationIds - The ID of the organization to create the reporting period for.
 * @returns The newly created reporting period object.
 */
  public static async createReportPeriod(requestData, organizationIds) {
    var organizationData;
    if (requestData.organizationId) {
      organizationData = await Organization.getOrganizationDetails('id', requestData.organizationId)
    }
    else {
      organizationData = await Organization.getOrganizationDetails('id', organizationIds)
    }
    const reportPeriodData = await organizationData.related('supplyChainReportingPeriod').create({
      id: uuidv4(),
      reportingPeriodFrom: DateTime.fromJSDate(new Date(requestData.reportingPeriodFrom)),
      reportingPeriodTo: DateTime.fromJSDate(new Date(requestData.reportingPeriodTo))
    })
    return reportPeriodData
  }


  /**
 * Gets the details of a reporting period by the given field and value.
 * 
 * @param field - The field to search by (e.g. 'id').
 * @param value - The value to search for.
 * @returns The reporting period object if found.
 */
  public static async getReportPeriodDetails(field, value) {
    const reportPeriodData = await SupplyChainReportingPeriod.query()
      .where(field, value)
      .andWhereNull('deletedAt')
      .preload('organization')
      // .preload('organization',(query)=>{
      //   query.preload('users')
      // })
      .preload('supplier', (query) => {
        query.preload('supplierProducts')
      })
      .firstOrFail();
    return reportPeriodData;
  }

  /**
 * Updates the given reporting period with new date values from the request data.
 */
  public static async updateReportPeriod(reportPeriodData, requestData) {
    reportPeriodData.merge({
      reportingPeriodFrom: DateTime.fromJSDate(new Date(requestData.reportingPeriodFrom)),
      reportingPeriodTo: DateTime.fromJSDate(new Date(requestData.reportingPeriodTo))
    }).save();

    return reportPeriodData;
  }




  /**
 * Deletes the given reporting period by setting its deletedAt timestamp.
 */
  public static async deleteReportPeriod(reportPeriodData) {
    await reportPeriodData.merge({ deletedAt: DateTime.now() }).save()
    return
  }
}

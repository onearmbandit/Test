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


  public static async getAllReportingPeriod(queryParams: ParsedQs) {
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

    const organizationReportingPeriods = await query.paginate(page, perPage);

    return organizationReportingPeriods
  }
  


  public static async createReportPeriod(requestData, auth) {
    var organizationData;
    if (requestData.organizationId) {
      organizationData = await Organization.getOrganizationDetails('id', requestData.organizationId)
    }
    else {
      organizationData = await Organization.getOrganizationDetails('id', auth?.user.organizations[0]?.id)
    }
    const reportPeriodData = await organizationData.related('supplyChainReportingPeriod').create({
      id: uuidv4(),
      reportingPeriodFrom: DateTime.fromJSDate(new Date(requestData.reportingPeriodFrom)),
      reportingPeriodTo: DateTime.fromJSDate(new Date(requestData.reportingPeriodTo))
    })
    return reportPeriodData
  }


  public static async getReportPeriodDetails(field, value) {
    const reportPeriodData = await SupplyChainReportingPeriod.query()
    .where(field, value)
    .andWhereNull('deletedAt')
    .preload('organization',(query)=>{
      query.preload('users')
    })
    .preload('supplier',(query) => {
      query.preload('supplierProducts')
    })
    .firstOrFail();
    return reportPeriodData;
  }

  public static async updateReportPeriod(requestData, params) {
    const reportPeriodData = await SupplyChainReportingPeriod.getReportPeriodDetails('id',params.id)
    reportPeriodData.merge({
      reportingPeriodFrom:DateTime.fromJSDate(new Date(requestData.reportingPeriodFrom)),
      reportingPeriodTo: DateTime.fromJSDate(new Date(requestData.reportingPeriodTo))
    }).save();

    return reportPeriodData;
  }
  



  public static async deleteReportPeriod(params) {
    const reportPeriodData = await SupplyChainReportingPeriod.getReportPeriodDetails('id',params.id)
    await reportPeriodData.merge({ deletedAt: DateTime.now() }).save()
    return
  }
}

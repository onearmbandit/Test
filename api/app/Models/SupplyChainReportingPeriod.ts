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

    // Format reportingPeriodFrom and reportingPeriodTo
    //  const formattedReportingPeriods = organizationReportingPeriods.map((period) => {
    //   return {
    //     ...period,
    //     reportingPeriodFrom: period.reportingPeriodFrom.toFormat("LLL yyyy"),
    //     reportingPeriodTo: period.reportingPeriodTo.toFormat("LLL yyyy"),
    //   };
    // });
    // console.log("formattedReportingPeriods",formattedReportingPeriods)

    // return formattedReportingPeriods;

    return organizationReportingPeriods
  }



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

  public static async updateReportPeriod(reportPeriodData, requestData) {
    reportPeriodData.merge({
      reportingPeriodFrom: DateTime.fromJSDate(new Date(requestData.reportingPeriodFrom)),
      reportingPeriodTo: DateTime.fromJSDate(new Date(requestData.reportingPeriodTo))
    }).save();

    return reportPeriodData;
  }




  public static async deleteReportPeriod(reportPeriodData) {
    await reportPeriodData.merge({ deletedAt: DateTime.now() }).save()
    return
  }
}

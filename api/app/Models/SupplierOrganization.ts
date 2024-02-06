import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { ParsedQs } from 'qs'


export default class SupplierOrganization extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ columnName: 'organization_id' })
  public organization_id: number

  @column({ columnName: 'supplier_id' })
  public supplier_id: number

  @column({ columnName: 'supplier_organization_id' })
  public supplier_organization_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime



  //:: Need to check
  public static async getAllSuppliersWithOrganization(queryParams: ParsedQs) {
    let allSuppliersData: any = {}

    const perPage = queryParams.perPage ? parseInt(queryParams.perPage as string, 10) : 20
    const page = queryParams.page ? parseInt(queryParams.page as string, 10) : 1
    const order = queryParams.order ? queryParams.order.toString() : 'desc'
    const sort = queryParams.sort ? queryParams.sort.toString() : 'updated_at'
    let filters: any = queryParams.filters ? queryParams.filters : {};
    let includes: string[] = queryParams.include ? (queryParams.include).split(',') : [];

    let query = this.query() // Exclude soft-deleted records;

    query = query.orderBy(sort, order)

    //::Filter Query
    if (typeof filters === 'object' && Object.keys(filters).length > 0) {
      if (('organizationId' in filters) && filters['organizationId'].length > 0) {
        query = query.whereHas('supplyChainReportingPeriod', (data) => {
          data.where('organizationId', filters['organizationId'])
        })
      }
    }

    //::Include Relationship
    if (includes.length > 0) {
      includes.forEach((include: any) => query.preload(include.trim()))
    }

    //:: Pagination handling
    if (queryParams.perPage && queryParams.perPage !== 'all') {
      allSuppliersData = await query.paginate(page, perPage)
    }
    else {
      allSuppliersData = await query
    }

    return allSuppliersData
  }
}

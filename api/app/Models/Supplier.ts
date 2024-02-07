import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import SupplyChainReportingPeriod from './SupplyChainReportingPeriod'
import SupplierProduct from './SupplierProduct'
import { ParsedQs } from 'qs'
import AbatementProject from './AbatementProject'
import Organization from './Organization'

export default class Supplier extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public supplyChainReportingPeriodId: string

  @column()
  public name: string

  @column()
  public email: string

  @column()
  public organizationRelationship: string

  @column()
  public address: string

  @column()
  public updatedBy: string

  @column.dateTime()
  public deletedAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  //::_____Relationships Start_____:://

  @belongsTo(() => SupplyChainReportingPeriod, {
    foreignKey: 'supplyChainReportingPeriodId',
  })
  public supplyChainReportingPeriod: BelongsTo<typeof SupplyChainReportingPeriod>

  @hasMany(() => SupplierProduct, {
    foreignKey: 'supplierId',
  })
  public supplierProducts: HasMany<typeof SupplierProduct>

  // @hasMany(() => AbatementProject, {
  //   foreignKey: 'supplierId',
  // })
  // public abatementProjects: HasMany<typeof AbatementProject>

  @hasMany(() => AbatementProject, {
    foreignKey: 'proposedBy',
  })
  public proposedProject: HasMany<typeof AbatementProject>


  @manyToMany(() => Organization, {
    localKey: 'id',
    pivotForeignKey: 'supplier_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'organization_id',
    pivotTable: 'supplier_organizations',
    pivotTimestamps: true,
  })
  public organizations: ManyToMany<typeof Organization>

  //::_____Relationships End_____:://

  public static async createSupplier(reportPeriodData, requestData, auth, trx: any = undefined) {
    const supplierData = await reportPeriodData.related('supplier').create(
      {
        id: requestData.id,
        name: requestData.name,
        email: requestData.email,
        organizationRelationship: requestData.organizationRelationship,
        address: requestData.address,
        updatedBy: `${auth.user?.firstName} ${auth.user?.lastName}`,
      },
      { client: trx }
    )
    return supplierData
  }

  public static async getSupplierDetails(field, value) {
    var supplierData = await Supplier.query()
      .where(field, value)
      .andWhereNull('deletedAt')
      .preload('supplyChainReportingPeriod', (query) => {
        query.select('id', 'reporting_period_from', 'reporting_period_to')
      })
      .preload('supplierProducts')
      .firstOrFail()

    return supplierData
  }

  public static async updateSupplier(supplierData, requestData, auth) {
    supplierData
      .merge({
        name: requestData.name,
        email: requestData.email,
        organizationRelationship: requestData.organizationRelationship,
        address: requestData.address,
        updatedBy: `${auth.user?.firstName} ${auth.user?.lastName}`,
      })
      .save()

    return supplierData
  }

  //:: Need to check
  public static async getAllSuppliersForSpecificUser(queryParams: ParsedQs) {
    let allSuppliersData: any = {}
    // let allOrganizationData: any = {}

    const perPage = queryParams.perPage ? parseInt(queryParams.perPage as string, 10) : 20
    const page = queryParams.page ? parseInt(queryParams.page as string, 10) : 1
    const order = queryParams.order ? queryParams.order.toString() : 'desc'
    const sort = queryParams.sort ? queryParams.sort.toString() : 'updated_at'
    let filters: any = queryParams.filters ? queryParams.filters : {};
    let includes: string[] = queryParams.include ? (queryParams.include).split(',') : [];

    let query = this.query().whereNull('deleted_at') // Exclude soft-deleted records;

    query = query.orderBy(sort, order)

    //::Filter Query
    if (typeof filters === 'object' && Object.keys(filters).length > 0) {
      //::filter as per various fields
      if (('supplyChainReportingPeriodId' in filters) && filters['supplyChainReportingPeriodId'].length > 0) {
        query.where('supplyChainReportingPeriodId', filters['supplyChainReportingPeriodId'])
      }

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


    //:: ORganization data handling


    return allSuppliersData
  }
}

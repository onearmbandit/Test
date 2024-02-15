import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, } from '@ioc:Adonis/Lucid/Orm'
import Supplier from './Supplier'
import Organization from './Organization'
import { v4 as uuidv4 } from 'uuid'
import { ParsedQs } from 'qs'


export default class AbatementProject extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  // @column()
  // public supplierId: string

  @column()
  public organizationId: string

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public estimatedCost: number

  @column()
  public websiteUrl: string

  @column()
  public emissionReductions: number

  @column()
  public emissionUnit: string

  @column()
  public proposedType: string

  @column()
  public proposedTo: string

  @column()
  public photoUrl: string

  @column()
  public logoUrl: string

  // @column()
  // public contactEmail: string

  @column()
  public status: number

  @column()
  public updatedBy: string

  @column.dateTime()
  public deletedAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime



  //::_____Relationships Start_____:://

  // @belongsTo(() => Supplier, {
  //   localKey: 'id',
  // })
  // public supplier: BelongsTo<typeof Supplier>

  @belongsTo(() => Organization, {
    localKey: 'id',
  })
  public organization: BelongsTo<typeof Organization>

  // @belongsTo(() => Supplier, {
  //   foreignKey: 'proposedTo',
  // })
  // public proposedSupplier: BelongsTo<typeof Supplier>

  //::_____Relationships End_____:://


  public static async getAllProjects(queryParams: ParsedQs, supplierOrganizationData: any) {
    let allProjectData: any = {}
    let perPage = queryParams.perPage ? parseInt(queryParams.perPage as string, 10) : 20
    let page = queryParams.page ? parseInt(queryParams.page as string, 10) : 1
    let order = queryParams.order ? queryParams.order.toString() : 'desc'
    let sort = queryParams.sort ? queryParams.sort.toString() : 'updated_at'
    let organizationId = queryParams.organizationId
      ? queryParams.organizationId.toString()
      : ''
    let filters: any = queryParams.filters ? queryParams.filters : {};
    let includes: string[] = queryParams.include ? (queryParams.include).split(',') : [];
    let proposedToId = supplierOrganizationData?.supplier_id

    let query = this.query().whereNull('deleted_at') // Exclude soft-deleted records;
    if (proposedToId) {
      query = query.where('proposedTo', proposedToId)
    }
    else {
      if (organizationId) {
        query = query.where('organizationId', organizationId)
      }
    }
    query = query.orderBy(sort, order)

    //::Filter Query
    if (typeof filters === 'object' && Object.keys(filters).length > 0) {
      //::filter as per collection status
      if (('status' in filters) && filters['status'].length > 0) {
        query.where('status', filters['status'])
      }
    }

    //::Include Relationship
    if (includes.length > 0) {
      includes.forEach((include: any) => query.preload(include.trim()))
    }

    //:: Pagination handling
    if (queryParams.perPage && queryParams.perPage !== 'all') {
      allProjectData = await query.paginate(page, perPage)
    }
    else {
      allProjectData = await query
    }


    return allProjectData

  }

  public static async createNewProject(requestData, auth, organizationData) {
    const projectData = await organizationData.related('abatementProjects').create(
      {
        id: uuidv4(),
        // supplierId: requestData.proposedBy,
        name: requestData.name,
        description: requestData.description,
        estimatedCost: requestData.estimatedCost,
        websiteUrl: requestData.websiteUrl,
        emissionReductions: requestData.emissionReductions,
        emissionUnit: requestData.emissionUnit,
        proposedType: requestData.proposedType ? requestData.proposedType : '',
        proposedTo: requestData.proposedTo,
        photoUrl: requestData.photoUrl,
        logoUrl: requestData.logoUrl,
        // contactEmail: requestData.contactEmail,
        status: requestData.status,
        updatedBy: `${auth.user?.firstName} ${auth.user?.lastName}`,
      }
    )
    return projectData
  }


  public static async getProjectDetails(field, value) {
    var supplierData = await AbatementProject.query()
      .where(field, value)
      .andWhereNull('deletedAt')
      .preload('organization')
      // .preload('proposedSupplier')
      .firstOrFail()

    let supplierDataJSON = supplierData.toJSON();
    if (supplierDataJSON.proposed_type == "supplier") {
      supplierDataJSON.proposedSupplier = await Supplier.query()
        .where('id', supplierDataJSON.proposed_to)
        .andWhereNull('deletedAt')
        .select('id', 'name', 'email', 'supply_chain_reporting_period_id')
        .firstOrFail()

      supplierDataJSON.proposedOrganization = {}
    }
    else if (supplierDataJSON.proposed_type == "organization") {
      supplierDataJSON.proposedOrganization = await Organization.query()
        .where('id', supplierDataJSON.proposed_to)
        .andWhereNull('deletedAt')
        .select('id', 'company_name')
        .preload('users')
        .firstOrFail()
      supplierDataJSON.proposedSupplier = {}
    }



    return supplierDataJSON
  }

  public static async getProjectData(field, value) {
    var supplierData = await AbatementProject.query()
      .where(field, value)
      .andWhereNull('deletedAt')
      .preload('organization')
      // .preload('proposedSupplier')
      .firstOrFail()

    return supplierData;
  }

  
  public static async updateProjectDetails(project, requestData) {
    await project.merge(requestData).save()
    // const projectData = await this.getProjectData('id', project.id)
    let projectData = await AbatementProject.getProjectDetails('id', project.id)
    return projectData
  }
}

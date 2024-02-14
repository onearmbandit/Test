import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, ManyToMany, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import { v4 as uuidv4 } from 'uuid'
// import Facility from './OrganizationFacility';
import SupplyChainReportingPeriod from './SupplyChainReportingPeriod'
import OrganizationFacility from './OrganizationFacility'
import { ParsedQs } from 'qs'
import AbatementProject from './AbatementProject'
import Supplier from './Supplier'

export default class Organization extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public user_id: string

  @column()
  public companyName: string

  @column()
  public companyEmail: string

  @column()
  public selfPointOfContact: string

  @column()
  public companySize: string

  @column()
  public naicsCode: string

  @column()
  public climateTargets: string

  @column()
  public companyAddress: string

  @column.dateTime()
  public deletedAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Relationship
  // @belongsTo(() => User, {
  //   localKey: 'user_id',
  // })
  // public user: BelongsTo<typeof User>

  //::_____Relationships Start_____:://

  @manyToMany(() => User, {
    localKey: 'id',
    pivotForeignKey: 'organization_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'user_id',
    pivotTable: 'organization_users',
    pivotTimestamps: true,
  })
  public users: ManyToMany<typeof User>

  @manyToMany(() => Supplier, {
    localKey: 'id',
    pivotForeignKey: 'organization_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'supplier_id',
    pivotTable: 'supplier_organizations',
    pivotTimestamps: true,
  })
  public suppliers: ManyToMany<typeof Supplier>

  @hasMany(() => OrganizationFacility, {
    foreignKey: 'organizations_id', // defaults to userId
  })
  public facilities: HasMany<typeof OrganizationFacility>

  @hasMany(() => SupplyChainReportingPeriod, {
    foreignKey: 'organizationId',
  })
  public supplyChainReportingPeriod: HasMany<typeof SupplyChainReportingPeriod>


  @hasMany(() => AbatementProject, {
    foreignKey: 'organizationId',
  })
  public abatementProjects: HasMany<typeof AbatementProject>

  //::_____Relationships End_____:://

  public static async getTargets(target: string) {
    let targetData = JSON.parse(target)
    return targetData
  }

  public static async setTargets(target: Array<String>) {
    let targetData = JSON.stringify(target)
    return targetData
  }

  public static async getOrganizationDetails(field, value) {
    const organizationData = await Organization.query()
      .where(field, value)
      .preload('users')
      .firstOrFail()
    return organizationData
  }

  public static async createOrganization(requestData) {
    const organizationData = await Organization.create({
      id: uuidv4(),
      companyName: requestData.companyName,
      companyAddress: requestData.companyAddress,
    })
    return organizationData
  }

  public static async updateOrganization(organization, requestData) {
    await organization.merge(requestData).save()
    const organizationData = await Organization.getOrganizationDetails('id', organization.id)
    return organizationData
  }

  public static async getAllOrganizations(queryParams: ParsedQs) {
    const perPage = queryParams.per_page ? parseInt(queryParams.per_page as string, 10) : 8
    const page = queryParams.page ? parseInt(queryParams.page as string, 10) : 1
    const order = queryParams.order ? queryParams.order.toString() : 'desc'
    const sort = queryParams.sort ? queryParams.sort.toString() : 'created_at'
    // const organizationId = queryParams.organizationId ? queryParams.organizationId.toString() : '';

    let query = this.query().whereNull('deleted_at') // Exclude soft-deleted records;

    // if (organizationId) {
    //   query = query.where('organization_id', organizationId);
    // }

    query = query.orderBy(sort, order)

    const organizations = await query.paginate(page, perPage)

    return organizations
  }
}

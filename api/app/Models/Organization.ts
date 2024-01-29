import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, ManyToMany, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import { v4 as uuidv4 } from 'uuid';
import Facility from './OrganizationFacility';
import SupplyChainReportingPeriod from './SupplyChainReportingPeriod';
import OrganizationFacility from './OrganizationFacility';


export default class Organization extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

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
  public climateTargets: string;

  @column()
  public addressLine_1: string

  @column()
  public addressLine_2: string

  @column()
  public city: string

  @column()
  public state: string

  @column()
  public country: string

  @column()
  public zipcode: string

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

  @hasMany(() => OrganizationFacility, {
    foreignKey: 'organizations_id', // defaults to userId
  })
  public facilities: HasMany<typeof OrganizationFacility>



  @hasMany(() => SupplyChainReportingPeriod, {
    foreignKey: 'organizationId',
  })
  public supplyChainReportingPeriod: HasMany<typeof SupplyChainReportingPeriod>



  //::_____Relationships End_____:://

  public static async getTargets(target: string) {
    let targetData = JSON.parse(target);
    return targetData
  }

  public static async setTargets(target: Array<String>) {
    let targetData = JSON.stringify(target);
    return targetData
  }

  public static async getOrganizationDetails(field, value) {
    const organizationData = await Organization.query()
    .where(field, value)
    .preload('users')
    .firstOrFail();
    return organizationData;
  }

  public static async createOrganization(requestData) {
    const organizationData = await Organization.create({
      id: uuidv4(),
      companyName: requestData.companyName,
      addressLine_1: requestData.addressLine1,
      addressLine_2: requestData.addressLine2,
      city: requestData.city,
      state: requestData.state,
      zipcode: requestData.zipcode,
    })
    return organizationData
  }


  public static async updateOrganization(organization, requestData) {
    await organization.merge(requestData).save();
    const organizationData = await Organization.getOrganizationDetails('id', organization.id)
    return organizationData;
  }
}

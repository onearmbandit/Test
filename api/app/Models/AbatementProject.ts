import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, } from '@ioc:Adonis/Lucid/Orm'
import Supplier from './Supplier'
import Organization from './Organization'
import { v4 as uuidv4 } from 'uuid'


export default class AbatementProject extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public supplierId: string

  @column()
  public organizationId: string

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public websiteUrl: string

  @column()
  public emissionReductions: number

  @column()
  public emissionUnit: string

  @column()
  public proposedBy: string

  @column()
  public photoUrl: string

  @column()
  public logoUrl: string

  @column()
  public contactEmail: string

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

  @belongsTo(() => Supplier, {
    localKey: 'id',
  })
  public supplier: BelongsTo<typeof Supplier>

  @belongsTo(() => Organization, {
    localKey: 'id',
  })
  public organization: BelongsTo<typeof Organization>

  //::_____Relationships End_____:://




  public static async createNewProject(requestData, auth, organizationData) {
    const projectData = await AbatementProject.create(
      {
        id: uuidv4(),
        supplierId: requestData.proposedBy,
        name: requestData.name,
        description: requestData.description,
        websiteUrl: requestData.websiteUrl,
        emissionReductions: requestData.emissionReductions,
        emissionUnit: requestData.emissionUnit,
        proposedBy: requestData.proposedBy,
        photoUrl: requestData.photoUrl,
        logoUrl: requestData.logoUrl,
        contactEmail: requestData.contactEmail,
        status: requestData.status,
        updatedBy: `${auth.user?.firstName} ${auth.user?.lastName}`,
      }
    )
    return projectData
  }
}

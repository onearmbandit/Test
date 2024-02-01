import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import FacilityEmission from './FacilityEmission'
import { v4 as uuidv4 } from 'uuid'

export default class FacilityProduct extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public facilityEmissionId: string

  @column()
  public name: string

  @column()
  public quantity: string

  @column()
  public functionalUnit: string

  @column({ columnName: 'scope_1_carbon_emission' })
  public scope1CarbonEmission: number

  @column({ columnName: 'scope_2_carbon_emission' })
  public scope2CarbonEmission: number

  @column({ columnName: 'scope_3_carbon_emission' })
  public scope3CarbonEmission: number

  @column()
  public equalityAttribute: boolean

  @column.dateTime({ columnName: 'deleted_at' })
  public deletedAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  //::_____Relationships Start_____:://

  @belongsTo(() => FacilityEmission, {
    foreignKey: 'facilityEmissionId',
  })
  public FacilityEmission: BelongsTo<typeof FacilityEmission>

  //::_____Relationships End_____:://

  public static async createFacilityProducts(emissionData, requestData) {
    let products: any = []
    requestData.facilityProducts.forEach(element => {
      let singleData = {
        id: uuidv4(),
        ...element
      }
      products.push(singleData)
    });

    let result = await emissionData.related('FacilityProducts').createMany(products);
    return result;
  }

  public static async getFacilityProductData(field, value) {
    const facilityProductDetails = await this.query()
      .where(field, value)
      .whereNull('deleted_at') // Exclude soft-deleted records
      .firstOrFail();
    return facilityProductDetails;
  }
}
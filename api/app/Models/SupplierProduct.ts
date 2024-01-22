import { DateTime } from 'luxon'
import {
  BaseModel, column,
  belongsTo, BelongsTo
} from '@ioc:Adonis/Lucid/Orm'
import Supplier from './Supplier'

export default class SupplierProduct extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public supplierId: string

  @column()
  public type: string

  @column()
  public name: string

  @column()
  public quantity: number

  @column()
  public functionalUnit: string

  @column()
  public scope3Contribution: number

  @column.dateTime()
  public deletedAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime



  //::_____Relationships Start_____:://

  @belongsTo(() => Supplier, {
    localKey: 'supplierId',
  })
  public supplier: BelongsTo<typeof Supplier>

  //::_____Relationships End_____:://

}

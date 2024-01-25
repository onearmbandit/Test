import { DateTime } from 'luxon'
import {
  BaseModel, column,
  belongsTo, BelongsTo
} from '@ioc:Adonis/Lucid/Orm'
import Supplier from './Supplier'
import { v4 as uuidv4 } from 'uuid';


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
  public scope_3Contribution: number

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

  public static async createSupplierProducts(supplierData, requestData) {
    let products: any = []
    requestData.supplierProducts.forEach(element => {
      let singleData = {
        id: uuidv4(),
        ...element
      }
      products.push(singleData)
    });
    let result = await supplierData.related('supplierProducts').createMany(products);
    return result;
  }

}

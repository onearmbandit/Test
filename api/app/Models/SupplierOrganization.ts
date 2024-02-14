import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import { ParsedQs } from 'qs'
import Organization from './Organization'
import Supplier from './Supplier'


export default class SupplierOrganization extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ columnName: 'organization_id' })
  public organizationId: number

  @column({ columnName: 'supplier_id' })
  public supplierId: number

  @column({ columnName: 'supplier_organization_id' })
  public supplierOrganizationId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  //::_____Relationships Start_____:://

  @belongsTo(() => Organization, {
    foreignKey: 'supplierOrganizationId',
    localKey: 'id',
  })
  public organization: BelongsTo<typeof Organization>

  @belongsTo(() => Supplier, {
    foreignKey: 'supplierId',
  })
  public supplier: BelongsTo<typeof Supplier>

  //::_____Relationships End_____:://


  public static async getAllSuppliersWithOrganization(queryParams: ParsedQs) {
    const order = queryParams.order ? queryParams.order.toString() : 'desc'
    let includes: string[] = queryParams.include ? (queryParams.include).split(',') : [];

    // Step 1: Iterate through the array
    const mergedArray: Array<string> = [];

    let query = this.query()

    // query = query.orderBy(sort, order)

    // Step 2: Include Relationship
    if (includes.length > 0) {
      includes.forEach((include: any) => query.preload(include.trim()))
    }

    (await query).forEach((item) => {
      // Step 3: Extract relevant information from supplier and organization objects
      const supplierName = item.supplier.name;
      const companyName = item.organization.companyName;

      // Step 3: Merge supplierName and companyName into one array
      mergedArray.push(supplierName, companyName);
    });

    // Step 4: Convert the merged array into a unique array
    const uniqueMergedArray = Array.from(new Set(mergedArray));

    // console.log(uniqueMergedArray);

    // Function to sort the array based on order ("asc" or "desc")
    const sortArray = (order: 'asc' | 'desc'): Array<string> => {
      return order === 'asc'
        ? uniqueMergedArray.slice().sort() // Use slice to create a copy and avoid modifying the original array
        : uniqueMergedArray.slice().sort((a, b) => b.localeCompare(a));
    };

    const sortedArray: Array<string> = sortArray(order);


    return sortedArray
  }
}

import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import { ParsedQs } from 'qs'
import Organization from './Organization'
import Supplier from './Supplier'

interface DataObject {
  name: string;
  id: string;
  type: string;
}

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


  /**
 * Gets all suppliers and organizations based on query parameters. 
 * Merges supplier and organization data into a single array, removes duplicates, and sorts alphabetically.
 * 
 * @param queryParams - The query parameters object. Can contain:
 * - order - Sort order ('asc' or 'desc'). Default is 'desc'.
 * - include - Relationships to eager load, comma separated.
 * - organizationId - Filter by organization ID.
 * 
 * @returns Sorted array of supplier and organization data objects containing name, id and type.
 */
  public static async getAllSuppliersWithOrganization(queryParams: ParsedQs) {
    const order = queryParams.order ? queryParams.order.toString() : 'desc'
    let includes: string[] = queryParams.include ? (queryParams.include).split(',') : [];
    let organizationId = queryParams.organizationId
      ? queryParams.organizationId.toString()
      : ''

    // Step 1: Iterate through the array
    const mergedArray: DataObject[] = [];

    let query = this.query().where('organization_id', organizationId)

    // Step 2: Include Relationship
    if (includes.length > 0) {
      includes.forEach((include: any) => query.preload(include.trim()))
    }

    const uniqueValuesSet = new Set(); // To store unique values

    (await query).forEach((item) => {
      // Step 3: Extract relevant information from supplier and organization objects
      const supplierName = item.supplier?.name;
      const companyName = item.organization?.companyName;

      if (item.supplier) {
        !uniqueValuesSet.has(supplierName) && mergedArray.push({
          name: supplierName,
          id: item.supplier.id.toString(),
          type: 'supplier'
        });
        uniqueValuesSet.add(item.supplier.name);
      }


      if (item.organization) {
        !uniqueValuesSet.has(companyName) && mergedArray.push({
          name: companyName,
          id: item.organization.id,
          type: 'organization'
        });
        uniqueValuesSet.add(item.organization.companyName);
      }
    });
    // // Function to sort the array based on order ("asc" or "desc")
    // const sortArray = (order: 'asc' | 'desc'): Array<string> => {
    //   return order === 'asc'
    //     ? uniqueMergedArray.slice().sort() // Use slice to create a copy and avoid modifying the original array
    //     : uniqueMergedArray.slice().sort((a, b) => b.localeCompare(a));
    // };

    // const sortedArray: Array<string> = sortArray(order);

    const sortArray = mergedArray.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      if (order == 'asc') {
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      }
      else {
        if (nameA > nameB) {
          return -1;
        }
        if (nameA < nameB) {
          return 1;
        }
        return 0;
      }
    });

    return sortArray
  }
}

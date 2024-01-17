import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { v4 as uuidv4 } from 'uuid';

export default class extends BaseSchema {
  protected tableName = 'roles'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo( uuidv4() )
      table.string('name').comment('value must be either super-admin, admin, sub-admin and supplier')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

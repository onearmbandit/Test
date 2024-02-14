import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'supplier_organizations'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('organization_id').nullable().references('organizations.id').onDelete('CASCADE')
      table.uuid('supplier_id').nullable().references('suppliers.id').onDelete('CASCADE')
      //:: Consider id of organization which will created by supplier when it regiter on site.
      table.uuid('supplier_organization_id').nullable().references('organizations.id').onDelete('CASCADE')

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

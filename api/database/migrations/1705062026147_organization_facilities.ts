import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'organization_facilities'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('organization_id')
      .nullable()
      .unsigned()
      .references('organizations.id')
      .onDelete('CASCADE')
      table.string('name');
      table.string('address_line_1');
      table.string('address_line_2');
      table.string('city');
      table.string('state');
      table.string('country');
      table.string('zip_code');
      table.timestamp('deleted_at', { useTz: true })

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

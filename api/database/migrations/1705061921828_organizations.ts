import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'organizations'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      // table.integer('user_id')
      // .nullable()
      // .unsigned()
      // .references('users.id')
      // .onDelete('CASCADE')
      table.string('company_name')
      table.string('company_email')
      table.string('self_point_of_contact')
      table.string('company_size')
      table.string('naics_code')
      table.jsonb('climate_targets')
      table.string('address_line_1');
      table.string('address_line_2');
      table.string('city');
      table.string('state');
      table.string('country');
      table.string('zipcode');
      table.timestamp('deleted_at', { useTz: true })
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'organizations'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('company_name')
      table.string('company_email')
      table.string('self_point_of_contact')
      table.string('company_size')
      table.string('naics_code')
      table.jsonb('climate_targets').comment('climate_targets is used to store the climate targets for the organization in json format')
      table.text('company_address')
      table.timestamp('deleted_at', { useTz: true })
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

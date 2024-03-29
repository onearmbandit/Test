import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'suppliers'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('supply_chain_reporting_period_id')
      .nullable()
      .references('supply_chain_reporting_periods.id')
      .onDelete('CASCADE')
      table.string('name')
      table.string('email')
      table.string('organization_relationship').comment('value must be either owned or contractor')
      table.text('address');
      table.string('updated_by');
      table.timestamp('deleted_at', { useTz: true })
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

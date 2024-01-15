import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'facility_emissions'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('organization_facility_id')
      .nullable()
      .unsigned()
      .references('organization_facilities.id')
      .onDelete('CASCADE')
      table.date('reporting_period_from')
      table.date('reporting_period_to')
      table.integer('scope_1_total_emission')
      table.integer('scope_2_total_emission')
      table.integer('scope_3_total_emission')
      table.float('emission_total')
      table.timestamp('deleted_at', { useTz: true })
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

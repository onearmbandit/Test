import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'facility_products'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('facility_emission_id')
        .nullable()
        .references('facility_emissions.id')
        .onDelete('CASCADE')
      table.string('name')
      table.integer('quantity')
      table.string('functional_unit').comment('e.g., tCO2e, liters, kgs')
      table.integer('scope_1_carbon_emission')
      table.integer('scope_2_carbon_emission')
      table.integer('scope_3_carbon_emission')
      // table.tinyint('equality_attribute').defaultTo(0).comment('0: not equal, 1: equal')
      table.timestamp('deleted_at', { useTz: true })
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

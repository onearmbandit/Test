import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'facility_equality_attributes'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('facility_emission_id')
        .nullable()
        .references('facility_emissions.id')
        .onDelete('CASCADE')
      table.tinyint('equality_attribute').defaultTo(0).comment('0: not equal, 1: equal')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

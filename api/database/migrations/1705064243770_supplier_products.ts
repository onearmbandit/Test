import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'supplier_products'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('supplier_id')
        .nullable()
        .references('suppliers.id')
        .onDelete('CASCADE')
      table.string('type')
      table.string('name')
      table.string('quantity')   //:: This field contains number and comma
      table.string('functional_unit').comment('e.g., tCO2e, liters, kgs')
      table.double('scope_3_contribution')
      table.timestamp('deleted_at', { useTz: true })
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

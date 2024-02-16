import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'abatement_projects'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      // table.uuid('supplier_id')
      // .nullable()
      // .references('suppliers.id')
      // .onDelete('CASCADE')
      table.uuid('organization_id')
        .nullable()
        .references('organizations.id')
        .onDelete('CASCADE')
      table.string('name')
      table.text('description')
      table.double('estimated_cost')
      table.text('website_url')
      table.integer('emission_reductions')
      table.string('emission_unit').comment('e.g., tCO2e, Gallons of water, Metric tonnes of waste')
      table.string('proposed_type')
      table.uuid('proposed_to').nullable()
        // .references('suppliers.id')
        // .onDelete('CASCADE')
      table.text('photo_url')
      table.text('logo_url')
      // table.string('contact_email') as per requirement
      table.tinyint('status').comment('0 for proposed, 1 for active and 2 for completed')
      table.string('updated_by');
      table.timestamp('deleted_at', { useTz: true })
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

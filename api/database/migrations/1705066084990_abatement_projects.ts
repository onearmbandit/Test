import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'abatement_projects'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('supplier_id')
      .nullable()
      .unsigned()
      .references('suppliers.id')
      .onDelete('CASCADE')
      table.integer('organization_id')
      .nullable()
      .unsigned()
      .references('organizations.id')
      .onDelete('CASCADE')
      table.string('name')
      table.text('description')
      table.text('website_url')
      table.integer('emission_reductions')
      table.string('proposed_by')
      table.text('photo_url')
      table.text('logo_url')
      table.string('contact_email')
      table.tinyint('status')
      table.timestamp('deleted_at', { useTz: true })
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

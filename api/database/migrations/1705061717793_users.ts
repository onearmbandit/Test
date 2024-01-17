import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      // table
      // .integer('organization_id')
      // .nullable()
      // .unsigned()
      // .references('organizations.id')
      // .onDelete('CASCADE')
      table.string('first_name')
      table.string('last_name')
      table.string('slug')
      table.string('email').unique()
      table.string('password')
      table.timestamp('email_verified_at').nullable()
      table.string('email_verify_token').nullable()
      table.integer('user_status').defaultTo(1)
      table.string('remember_token')
      table.timestamp('remember_token_expires').nullable()
      table.string('timezone');
      table.string('login_type');
      table.string('registration_step');
      table.timestamp('deleted_at', { useTz: true })
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'organization_users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('user_id')
      .nullable()
      .references('users.id')
      .onDelete('CASCADE')
      table.uuid('organization_id')
      .nullable()
      .references('organizations.id')
      .onDelete('CASCADE')
      table.uuid('role_id')
      .nullable()
      .references('roles.id')
      .onDelete('CASCADE')
      .comment('Specify the type of the user in the organization, e.g., admin, super admin')

      table.uuid('invited_by')
      .nullable()
      .references('users.id')
      .onDelete('CASCADE')
      .comment('Specify the who is invited to users for the organization')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

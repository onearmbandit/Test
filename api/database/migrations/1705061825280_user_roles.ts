import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'user_roles'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id')
      table.uuid('user_id')
      .nullable()
      .references('users.id')
      .onDelete('CASCADE')
      table.uuid('role_id')
      .nullable()
      .references('roles.id')
      .onDelete('CASCADE')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('first_name')
      table.string('last_name')
      table.string('slug').comment('slug is used for the user profile url')
      table.string('email').unique()
      table.string('password').comment('password is hashed and salted')
      table.timestamp('email_verified_at').nullable().comment('email_verified_at is used for email verification')
      table.string('email_verify_token').nullable().comment('email_verify_token is used for email verification')
      table.integer('user_status').defaultTo(1).comment('user_status is used to determine if the user is active or not. 1 for active and 0 for inactive')
      table.string('remember_token')
      table.timestamp('remember_token_expires').nullable()
      table.string('timezone');
      table.string('login_type').comment("login type will be to know from sso or from email/password so values will be google, microsoft and web");
      table.string('registration_step').defaultTo(0).comment("registration step will be used to know at which step the user is at registration");
      table.timestamp('deleted_at', { useTz: true }).comment('deleted_at is used to determine if the user is deleted or not: soft delete')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

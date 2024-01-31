import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class InviteOrganizationValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string([ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string([
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    first_name: schema.string({ trim: true }, [
      rules.required(),
      rules.minLength(3),
      rules.maxLength(255),
      rules.nullable(),
    ]),

    last_name: schema.string({ trim: true }, [
      rules.required(),
      rules.minLength(3),
      rules.maxLength(255),
      rules.nullable(),
    ]),

    email: schema.string({ trim: true }, [
      rules.required(),
      rules.email(),
      rules.minLength(3),
      rules.maxLength(255),
      rules.unique({ table: 'organization_users', column: 'email' }),
    ]),

    role_id: schema.string({ trim: true }, [
      rules.uuid(),
      rules.exists({ table: 'roles', column: 'id' }),
    ]),
    invited_by: schema.string({ trim: true }, [
      rules.uuid(),
      rules.exists({ table: 'users', column: 'id' }),
    ]),
    organization_id: schema.string({ trim: true }, [
      rules.uuid(),
      rules.exists({ table: 'organizations', column: 'id' }),
    ]),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    'organization_id.exists': 'Organization with this ID does not exist.',
    'invited_by.exists': 'User with this ID does not exist.',
    'role_id.exists': 'Role with this ID does not exist.',

    'first_name.required': 'First Name is required.',
    'first_name.minLength': 'First Name must be at least 3 characters long.',
    'first_name.maxLength': 'First Name must not exceed 255 characters.',

    'last_name.required': 'Last Name is required.',
    'last_name.minLength': 'Last Name must be at least 3 characters long.',
    'last_name.maxLength': 'Last Name must not exceed 255 characters.',

    'email.required': 'Email is required.',
    'email.minLength': 'Email must be at least 3 characters long.',
    'email.maxLength': 'Email must not exceed 255 characters.',
    'email.unique': 'Invitation is already sent to this email',
  }
}

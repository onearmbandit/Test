import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class InviteOrganizationValidator {
  constructor(protected ctx: HttpContextContract) {}

 
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
    'email.unique': 'The email address you are trying to invite has already been registered with another organization',
  }
}

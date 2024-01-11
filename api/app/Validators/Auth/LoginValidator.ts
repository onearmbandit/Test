import { schema, CustomMessages,rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LoginValidator {
  constructor(protected ctx: HttpContextContract) {}


  public schema = schema.create({
    email: schema.string({ trim: true }, [rules.email()]),
    password: schema.string(),
  })

  /**
   * Custom messages for validation failures. 
   *
   */
  public messages: CustomMessages = {
    'password.required': 'Please enter the password.',
    'email.required': 'Please enter the e-mail address.',
    'email.email': 'Please enter the valid e-mail address.',
  }
}

import { schema, CustomMessages ,rules} from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ForgotPasswordValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({ trim: true }, [rules.email()]),
  })

  public messages: CustomMessages = {
    'email.required': 'Please enter the e-mail address.',
    'email.email': 'Please enter the valid e-mail address.',
  }
}

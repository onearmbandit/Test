import { schema, CustomMessages ,rules} from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SignupValidator {
  constructor(protected ctx: HttpContextContract) {}


  public schema = schema.create({
    email: schema.string({ trim: true }, [rules.email()]),
    password: schema.string([
      rules.minLength(8),
      rules.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
    ]),

    
    // first_name: schema.string({ trim: true }),
    // last_name: schema.string({ trim: true }),
  })


  public messages: CustomMessages = {
    'password.required': 'Please enter the password.',
    'email.required': 'Please enter the e-mail address.',
    'email.email': 'Please enter the valid e-mail address.',
    'password.minLength': 'Password must be minimun 8 characters.',
    'password.regex':'Password must contain at least one lowercase, one uppercase, one digit, and one special character.'
  }
}

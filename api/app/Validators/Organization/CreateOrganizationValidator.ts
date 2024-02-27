import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateOrganizationValidator {
  constructor(protected ctx: HttpContextContract) {}


  public schema = schema.create({
    companyName: schema.string({ trim: true }, [
      rules.required(),
      rules.minLength(2),
      rules.maxLength(50),
      rules.unique({ table: 'organizations', column: 'company_name' }),
    ]),
  })

  public messages: CustomMessages = {
    'companyName.required': 'Company Name is required.',
    'companyName.minLength': 'Company Name must be at least 2 characters long.',
    'companyName.maxLength': 'Company Name must not exceed 50 characters.',
    'companyName.unique': 'Organization with same company name already exists.',
  }
}

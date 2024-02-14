import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateOrganizationValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    naicsCode: schema.string.optional({}, [
      // rules.when((values, data) => data.naicsCode !== undefined, [
      rules.regex(/^[0-9]{4,5}$/),
      // ]),
    ]),

    climateTargets: schema.array
      .optional()
      .members(schema.string({}, [rules.minLength(2), rules.maxLength(50)])),
    companyEmail: schema.string.optional({}, [
      rules.email(),
      rules.unique({ table: 'users', column: 'email' }),
      // rules.unique({ table: 'organizationUsers', column: 'email' }),
    ]),
  })

  public messages = {
    'naicsCode.regex': 'NAICS codes must be 4-5 digits.',
    'climateTargets.*.minLength': 'Each target must be at least 2 characters long.',
    'climateTargets.*.maxLength': 'Each target must be at most 30 characters long.',
    'companyEmail.unique': 'Email already exists in our DB.',
  }
}

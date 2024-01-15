import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateOrganizationValidator {
  constructor(protected ctx: HttpContextContract) {
  }


  public schema = schema.create({
    naicsCode: schema.string.optional({}, [
      // rules.when((values, data) => data.naicsCode !== undefined, [
      rules.regex(/^[0-9]{4,5}$/),
      // ]),
    ]),

    targets: schema.array.optional().members(
      schema.string({}, [
        rules.minLength(2),
        rules.maxLength(30),
      ])
    ),
  })



  public messages = {
    'naicsCode.regex': 'NAICS codes must be 4-5 digits.',
    'targets.*.minLength': 'Each target must be at least 2 characters long.',
    'targets.*.maxLength': 'Each target must be at most 30 characters long.',
  };
}

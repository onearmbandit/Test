import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateFacilityValidator {
  constructor(protected ctx: HttpContextContract) {
  }


  public schema = schema.create({
    name: schema.string.optional({}, [
      rules.minLength(5),
      rules.maxLength(255),
    ]),

    address: schema.string.optional({}, [
      rules.minLength(5),
      rules.maxLength(500)
    ]),

  })


  public messages = {
    'name.minLength': 'Name must be at least 5 characters long.',
    'name.maxLength': 'Name must not exceed 255 characters.',

    'address.minLength': 'Address must be at least 5 characters long.',
    'address.maxLength': 'Address must not exceed 500 characters.',
  };
}

import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateFacilityValidator {
  constructor(protected ctx: HttpContextContract) {
  }


  public schema = schema.create({
    name:schema.string.optional({}, [
      rules.minLength(5),
      rules.maxLength(255),
      rules.unique({ table: 'organization_facilities', column: 'name' })
    ]),

    address:schema.string.optional({}, [
      rules.minLength(5),
      rules.maxLength(500)
    ]),

  })


  public messages = {
    'name.minLength': 'Name must be at least 5 characters long.',
    'name.maxLength': 'Name must not exceed 255 characters.',
    'name.unique': 'Name already exists. Please choose a different name.',

    'address.minLength': 'Address must be at least 5 characters long.',
    'address.maxLength': 'Address must not exceed 500 characters.',
  };
}

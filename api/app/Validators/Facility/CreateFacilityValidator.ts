import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default  class  CreateFacilityValidator {
  constructor(protected ctx: HttpContextContract) {}


  public schema = schema.create({
    organization_id: schema.string.optional({ trim: true }, [
      rules.uuid(),
      rules.exists({ table: 'organizations', column: 'id' }),
    ]),

    name:schema.string({ trim: true}, [
      rules.required(),
      rules.minLength(5),
      rules.maxLength(255),
      rules.unique({ table: 'organization_facilities', column: 'name' })
    ]),

    address:schema.string({ trim: true }, [
      rules.required(),
      rules.minLength(5),
      rules.maxLength(500)
    ]),

  })

  public messages = {
    'organization_id.exists': 'Organization with this ID does not exist.',

    'name.required': 'Name is required.',
    'name.minLength': 'Name must be at least 5 characters long.',
    'name.maxLength': 'Name must not exceed 255 characters.',
    'name.unique': 'Name already exists. Please choose a different name.',

    'address.required': 'Address is required.',
    'address.minLength': 'Address must be at least 5 characters long.',
    'address.maxLength': 'Address must not exceed 500 characters.',

  }
}

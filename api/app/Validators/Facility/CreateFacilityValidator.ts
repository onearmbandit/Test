import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateFacilityValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    organization_id: schema.string({ trim: true }, [
      rules.uuid(),
      rules.exists({ table: 'organizations', column: 'id' }),
    ]),

    facilities: schema.array().members(
      schema.object().members({
        name: schema.string({ trim: true }, [rules.minLength(3), rules.maxLength(255)]),
        addressLine1: schema.string({ trim: true }, [rules.maxLength(255)]),
        addressLine2: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
        city: schema.string({ trim: true }, [rules.maxLength(100)]),
        state: schema.string({ trim: true }, [rules.maxLength(50)]),
        zipCode: schema.string({ trim: true }, [rules.maxLength(20)]),
      })
    ),
  })

  public messages = {
    'organization_id.exists': 'Organization with this ID does not exist.',
    'facilities.*.name.minLength': 'Facility name must be at least 3 characters.',
    'facilities.*.name.maxLength': 'Facility name cannot exceed 255 characters.',
    'facilities.*.addressLine1.maxLength': 'Address Line 1 cannot exceed 255 characters.',
    'facilities.*.addressLine2.maxLength': 'Address Line 2 cannot exceed 255 characters.',
    'facilities.*.city.maxLength': 'City cannot exceed 100 characters.',
    'facilities.*.state.maxLength': 'State cannot exceed 50 characters.',
    'facilities.*.zipCode.maxLength': 'Zip code cannot exceed 20 characters.',
  }
}

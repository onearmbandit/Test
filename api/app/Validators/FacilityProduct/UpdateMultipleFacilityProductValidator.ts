import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateMultipleFacilityProductValidator {
  constructor(protected ctx: HttpContextContract) { }

  public schema = schema.create({
    facilityEmissionId: schema.string({ trim: true }, [
      rules.uuid(),
      rules.exists({ table: 'facility_emissions', column: 'id' }),
    ]),

    facilityProducts: schema.array().members(
      schema.object().members({
        name: schema.string.optional({ trim: true }, [
          // rules.required(),
          rules.minLength(3),
          rules.maxLength(255),
          // rules.unique({ table: 'facility_products', column: 'name' })
        ]),
        quantity: schema.number.optional(),
        functionalUnit: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
      })
    ),
  })

  public messages = {
    'name.required': 'Name is required.',
    'name.minLength': 'Name must be at least 5 characters long.',
    'name.maxLength': 'Name must not exceed 255 characters.',
    'name.unique': 'Name already exists. Please choose a different name.',

    'quantity.number': 'Quantity must be a number.',
    'functional_unit.maxLength': 'Functional unit must not exceed 255 characters.',

  }
}

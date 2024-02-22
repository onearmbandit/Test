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
          rules.minLength(1),
          rules.maxLength(255),
        ]),
        quantity: schema.number.optional(),
        functionalUnit: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
      })
    ),
  })

  public messages = {
    'facilityProducts.*.name.required': 'Product name is required.',
    'facilityProducts.*.name.maxLength': 'Product name cannot exceed 255 characters.',
    'facilityProducts.*.name.minLength': 'Product name must be at least 1 characters long.',

    'facilityProducts.*.quantity.number': 'Quantity must be a number.',
    'facilityProducts.*.quantity.required': 'Quantity is required.',

    'facilityProducts.*.functionalUnit.required': 'Functional unit is required.',
    'facilityProducts.*.functionalUnit.maxLength': 'Functional unit must not exceed 255 characters.',

  }
}

import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AddSupplierProductValidator {
	constructor(protected ctx: HttpContextContract) {
	}


	public schema = schema.create({
		supplierId: schema.string({ trim: true }, [
			rules.uuid(),
			rules.exists({ table: 'suppliers', column: 'id' }),
		]),
		supplierProducts: schema.array().members(
			schema.object().members({
				name: schema.string({ trim: true }, [rules.minLength(3), rules.maxLength(255)]),
				type: schema.string({ trim: true }, [rules.minLength(3), rules.maxLength(255)]),
				quantity: schema.number(),
				// functionalUnit: schema.string({ trim: true }, [rules.maxLength(255)]),
				scope_3Contribution: schema.number(),
			})
		),
	})


	public messages = {
		'supplierId.exists': 'Supplier with this ID does not exist.',
		'supplierProducts.*.name.minLength': 'Product name must be at least 3 characters.',
		'supplierProducts.*.name.maxLength': 'Product name cannot exceed 255 characters.',
		'supplierProducts.*.type.minLength': 'Product type must be at least 3 characters.',
		'supplierProducts.*.type.maxLength': 'Product type cannot exceed 255 characters.',
		'supplierProducts.*.quantity.number': 'Please enter valid number',
		'supplierProducts.*.functionalUnit.maxLength': 'Product functional unit cannot exceed 255 characters.',
		'supplierProducts.*.scope_3Contribution.number': 'Please enter valid number',
	}
}

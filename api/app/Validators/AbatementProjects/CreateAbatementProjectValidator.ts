import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateAbatementProjectValidator {
	constructor(protected ctx: HttpContextContract) {
	}

	public schema = schema.create({
		name: schema.string.optional({ trim: true }, [rules.minLength(3), rules.maxLength(255)]),
		description: schema.string.optional({ trim: true }, [rules.maxLength(500)]),
		emissionReductions: schema.number.optional(),
		photoUrl: schema.string.optional(),
		logoUrl: schema.string.optional(),
		contactEmail: schema.string.optional({}, [
			rules.email(),
		]),
		status: schema.enum.optional([0, 1, 2] as const),
		proposedBy: schema.string({ trim: true }, [
			rules.uuid(),
			rules.exists({ table: 'suppliers', column: 'id' }),
		  ]),
	})


	public messages = {
		'name.minLength': 'Abatement project name must be at least 3 characters.',
		'name.maxLength': 'Abatement project name cannot exceed 255 characters.',
		'description.maxLength': 'Description cannot exceed 500 characters.',
		'emissionReductions.number': 'Emission reduction must be a number.',
		'contactEmail.required': 'Email field is required.',
		'contactEmail.email': 'Please enter a valid email.',
		'status.enum': 'The value must be one of {{ options.choices }}',
		'proposedBy.exists': 'Supplier with this ID does not exist.',

	}
}

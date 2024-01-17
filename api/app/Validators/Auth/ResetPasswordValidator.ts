import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ResetPasswordValidator {
	constructor(protected ctx: HttpContextContract) {
	}


	public schema = schema.create({
		email: schema.string({}, [
			rules.email(),]),
		token: schema.string(),
		newPassword: schema.string([
			rules.minLength(8),
			rules.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
			rules.confirmed('confirmPassword'), // This ensures that confirmPassword is equal to newPassword
		]),
		confirmPassword: schema.string([
			rules.minLength(8),
			rules.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
		]),

	})

	public messages = {
		'newPassword.required': 'Please enter the new Password.',
		'newPassword.minLength': 'New Password must be minimun 8 characters.',
		'newPassword.regex': 'New Password must contain at least one lowercase, one uppercase, one digit, and one special character.',
		'confirmPassword.confirmed': "Confirm password mismatch."
	}
}

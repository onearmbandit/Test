import { schema ,rules} from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SocialSignupOrLoginValidator {
	constructor(protected ctx: HttpContextContract) {
	}

	public schema = schema.create({
		email: schema.string({ trim: true }, [rules.email()]),
		socialLogintoken: schema.string(),
		loginType: schema.string()
	})


	public messages = {
		'email.required': 'Please enter the e-mail address.',
		'socialLogintoken.required': 'Social login token field required.',
		'loginType.required': 'Login type field required.',
		'email.email': 'Please enter the valid e-mail address.',
	}
}

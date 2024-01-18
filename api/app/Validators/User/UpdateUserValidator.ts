import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class UpdateUserValidator {
  constructor(protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    firstName: schema.string.optional({}, [
      rules.minLength(2),
      rules.maxLength(30),
      rules.alpha(),
      rules.trim(),
      rules.escape()
    ]),

    lastName: schema.string.optional({}, [
      rules.minLength(2),
      rules.maxLength(30),
      rules.alpha(),
      rules.trim(),
      rules.escape()
    ]),

    // oldPassword: schema.string.optional({}, [
    //   rules.minLength(8),
    //   rules.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
    //   async (value, { error }) => {
    //     const user = this.ctx.auth.user;
    //     if (user) {
    //       const isPasswordValid = await user.verifyPassword(value);
    //       if (!isPasswordValid) {
    //         error('Old password does not match the current password');
    //       }
    //     }
    //   },
    // ]),

    // newPassword: schema.string.optional({}, [
		// 	rules.minLength(8),
		// 	rules.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
		// 	rules.confirmed('confirmPassword'), // This ensures that confirmPassword is equal to newPassword
		// ]),
		// confirmPassword: schema.string.optional({}, [
		// 	rules.minLength(8),
		// 	rules.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
		// ]),

    email: schema.string.optional({}, [
      rules.email(),
      rules.unique({ table: 'users', column: 'email' }),
      // rules.unique({ table: 'users', column: 'email' ,whereNot: { id: this.ctx.params.id } }),
    ]),

  })

  public messages = {
    'email.unique': 'Email already exists in our DB.',
    'oldPassword.regex': 'Old password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character',
    'newPassword.regex': 'New password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character',
    'confirmPassword.regex': 'Confirm password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character',
    'newPassword.confirmed': 'Passwords do not match',
  };
}

import { schema ,rules} from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateSupplierDatumValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
	supplyChainReportingPeriodId: schema.string.optional({ trim: true }, [
		rules.uuid(),
		rules.exists({ table: 'supply_chain_reporting_periods', column: 'id' }),
	  ]),
	  name: schema.string.optional({ trim: true }, [rules.minLength(3), rules.maxLength(255)]),
	  email: schema.string.optional({}, [
		rules.email(),
	  ]),
	  address: schema.string.optional({ trim: true }, [rules.maxLength(500)]),
  })


  public messages = {
	'email.email':'Please enter a valid email.',
    'zipCode.minLength': 'Zip code must be contains at least 5 characters.',
    'name.minLength': 'Supplier name must be at least 3 characters.',
    'name.maxLength': 'Supplier name cannot exceed 255 characters.',
    'address.maxLength': 'Address cannot exceed 500 characters.',
  }
}

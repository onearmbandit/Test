import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class DeleteMultipleSupplierProductValidator {
	constructor(protected ctx: HttpContextContract) {
	}

	public schema = schema.create({
		supplyChainReportingPeriodId: schema.string({ trim: true }, [
			rules.uuid(),
			rules.exists({ table: 'supply_chain_reporting_periods', column: 'id' }),
		]),
		supplierProducts: schema.array().members(schema.string())
	})


	public messages = {
		'supplyChainReportingPeriodId.exists': 'Supply chain reporting period with this ID does not exist.',
		'supplierProducts.required': "Supplier products field required."
	}
}

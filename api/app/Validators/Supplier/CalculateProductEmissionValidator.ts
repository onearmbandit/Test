import { schema,rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CalculateProductEmissionValidator {
  constructor (protected ctx: HttpContextContract) {
  }


  public schema = schema.create({
	supplyChainReportingPeriodId: schema.string({ trim: true }, [
		rules.uuid(),
		rules.exists({ table: 'supply_chain_reporting_periods', column: 'id' }),
	  ]),
  })

  public messages = {}
}

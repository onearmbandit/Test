import { schema, CustomMessages ,rules} from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { DateTime } from 'luxon'

export default class SupplyChainReportingPeriodValidator {
  constructor(protected ctx: HttpContextContract) {    
  }

  /**
 * Defines schema references for validating the allowed date. 
 * The allowed date is parsed from the request body's reportingPeriodFrom property.
*/
  public refs = schema.refs({
    allowedDate: DateTime.fromJSDate(new Date(this.ctx.request.body().reportingPeriodFrom))
  })
  

  public schema = schema.create({
    organizationId: schema.string.optional({ trim: true }, [
      rules.uuid(),
      rules.exists({ table: 'organizations', column: 'id' }),
    ]),
    reportingPeriodFrom: schema.date({ format: 'yyyy-MM' }),
    reportingPeriodTo: schema.date({ format: 'yyyy-MM' },[
      rules.after(this.refs.allowedDate)
    ]),
  })


  public messages: CustomMessages = {
    'organizationId.exists': 'Organization with this ID does not exist.',
    'reportingPeriodFrom.required': 'Reporting period from is required.',
    'reportingPeriodTo.required': 'Reporting period to is required.',
    'reportingPeriodFrom.date': 'Invalid date format for reporting period from. Use YYYY-MM.',
    'reportingPeriodTo.date': 'Invalid date format for reporting period to. Use YYYY-MM.',
    'reportingPeriodTo.before':'Reporting period to must be greater than reporting period from.'
  }
}

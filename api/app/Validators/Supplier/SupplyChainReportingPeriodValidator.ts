import { schema, CustomMessages ,rules} from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { DateTime } from 'luxon'

export default class SupplyChainReportingPeriodValidator {
  constructor(protected ctx: HttpContextContract) {
    console.log("ctx",DateTime.fromJSDate(new Date(this.ctx.request.body().reportingPeriodFrom)))
    
  }

  public refs = schema.refs({
    allowedDate: DateTime.fromJSDate(new Date(this.ctx.request.body().reportingPeriodFrom))
  })
  

  public schema = schema.create({
    reportingPeriodFrom: schema.date({ format: 'yyyy-MM' }),
    reportingPeriodTo: schema.date({ format: 'yyyy-MM' },[
      rules.after(this.refs.allowedDate)
    ]),
  })


  public messages: CustomMessages = {
    'reportingPeriodFrom.required': 'Reporting period from is required.',
    'reportingPeriodTo.required': 'Reporting period to is required.',
    'reportingPeriodFrom.date': 'Invalid date format for reporting period from. Use YYYY-MM.',
    'reportingPeriodTo.date': 'Invalid date format for reporting period to. Use YYYY-MM.',
    'reportingPeriodTo.before':'Reporting period to must be greater than reporting period from.'
  }
}

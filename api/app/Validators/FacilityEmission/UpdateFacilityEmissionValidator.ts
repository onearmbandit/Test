import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { DateTime } from 'luxon'

export default class UpdateFacilityEmissionValidator {
  constructor(protected ctx: HttpContextContract) {
  }

  public refs = schema.refs({
    allowedDate: DateTime.fromJSDate(new Date(this.ctx.request.body().reportingPeriodFrom))
  })


  public schema = schema.create({
    reportingPeriodFrom: schema.date.optional({ format: 'yyyy-MM' }),
    reportingPeriodTo: schema.date.optional({ format: 'yyyy-MM' }, [
      rules.after(this.refs.allowedDate)
    ]),
    scope1TotalEmission: schema.number.optional(),
    scope2TotalEmission: schema.number.optional(),
    scope3TotalEmission: schema.number.optional(),
  })


  public messages = {
    'reporting_period_from.required': 'Reporting period from is required.',
    'reporting_period_to.required': 'Reporting period to is required.',
    'reporting_period_from.date': 'Invalid date format for reporting period from. Use YYYY-MM.',
    'reporting_period_to.date': 'Invalid date format for reporting period to. Use YYYY-MM.',
    'reporting_period_to.before': 'Reporting period to must be greater than reporting period from.',
    'scope_1_total_emission.number': 'Scope 1 total emission must be a number.',
    'scope_2_total_emission.number': 'Scope 2 total emission must be a number.',
    'scope_3_total_emission.number': 'Scope 3 total emission must be a number.',
  };
}

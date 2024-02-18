import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { DateTime } from 'luxon'
// import Database from '@ioc:Adonis/Lucid/Database';
// import { isValidReportingPeriod } from './IsValidReportingPeriod';


export default class ReportingPeriodValidator {
  constructor(protected ctx: HttpContextContract) {
  }

  public refs = schema.refs({
    allowedDate: DateTime.fromJSDate(new Date(this.ctx.request.body().reportingPeriodFrom))
  })

  public schema = schema.create({
    organizationFacilityId: schema.string({ trim: true }, [
      rules.uuid(),
      rules.exists({ table: 'organization_facilities', column: 'id' }),
    ]),
    reportingPeriodFrom: schema.date({ format: 'yyyy-MM' }),
    reportingPeriodTo: schema.date({ format: 'yyyy-MM' }
    ),
  })


  public messages: CustomMessages = {
    'organization_facility_id.exists': 'Organization facility with this ID does not exist.',
    'reporting_period_from.required': 'Reporting period from is required.',
    'reporting_period_to.required': 'Reporting period to is required.',
    'reporting_period_from.date': 'Invalid date format for reporting period from. Use YYYY-MM.',
    'reporting_period_to.date': 'Invalid date format for reporting period to. Use YYYY-MM.',
    'reporting_period_to.before': 'Reporting period to must be greater than reporting period from.'
  }

}

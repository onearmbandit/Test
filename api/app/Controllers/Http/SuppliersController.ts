import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { apiResponse } from 'App/helpers/response'
import Config from '@ioc:Adonis/Core/Config'
import { v4 as uuidv4 } from 'uuid'
import ExcelJS from 'exceljs'
import Application from '@ioc:Adonis/Core/Application'
import SupplyChainReportingPeriod from 'App/Models/SupplyChainReportingPeriod'
import Supplier from 'App/Models/Supplier'
import Database from '@ioc:Adonis/Lucid/Database'
import AddSupplierDatumValidator from 'App/Validators/Supplier/AddSupplierDatumValidator'
import UpdateSupplierDatumValidator from 'App/Validators/Supplier/UpdateSupplierDatumValidator'
import SupplierProduct from 'App/Models/SupplierProduct'
import { sendMail } from 'App/helpers/sendEmail'

const WEB_BASE_URL = process.env.WEB_BASE_URL

export default class SuppliersController {

  /**
 * Gets all suppliers for the authenticated user with optional filtering.
 * @returns A JSON response with suppliers data and metadata.
 */
  public async index({ request, response }: HttpContextContract) {
    try {
      const queryParams = request.qs()

      const allSuppliersData = await Supplier.getAllSuppliersForSpecificUser(queryParams)

      const isPaginated = request.input('perPage') && request.input('perPage') !== 'all'
      return apiResponse(
        response,
        true,
        200,
        allSuppliersData,
        Config.get('responsemessage.COMMON_RESPONSE.getRequestSuccess'),
        isPaginated
      )
    } catch (error) {
      console.log('error', error)
      if (error.status === 422) {
        return apiResponse(
          response,
          false,
          error.status,
          error.messages,
          Config.get('responsemessage.COMMON_RESPONSE.validationFailed')
        )
      } else {
        return apiResponse(
          response,
          false,
          400,
          {},
          error.messages ? error.messages : error.message
        )
      }
    }
  }

  /**
 * Creates a new supplier.
 * 
 * Validates request data, authorizes user, initializes transaction, creates supplier, 
 * sends invite email, attaches supplier to organization in pivot table, 
 * commits transaction or rolls back on error.
 * @param auth - The authenticated user
 * @param bouncer - The authorization service  
*/
  public async store({ request, response, auth, bouncer }: HttpContextContract) {
    //::Initialize database transaction
    const trx = await Database.transaction()

    try {
      let requestData = request.all()

      await request.validate(AddSupplierDatumValidator)
      var reportPeriodData = await SupplyChainReportingPeriod.getReportPeriodDetails(
        'id',
        requestData.supplyChainReportingPeriodId
      )
      //:: Authorization (auth user can create suppliers for their reporting periods only)
      await bouncer.with('SuppliersPolicy').authorize('create', reportPeriodData.toJSON())

      requestData = { ...requestData, id: uuidv4() }
      var supplierData = await Supplier.createSupplier(reportPeriodData, requestData, auth, trx)

      const emailData = {
        initials: (auth.user?.firstName && auth.user?.lastName) ? auth.user?.firstName[0] + auth.user?.lastName[0] : '',
        fullName: `${auth.user?.firstName} ${auth.user?.lastName}`,
        organizationName: reportPeriodData.organization?.toJSON().company_name,
        email: requestData.email,
        url: `${WEB_BASE_URL}/register?email=${requestData.email}&isSupplier=true`,   // isSupplier required to know invited user is supplier 
      }


      await sendMail(
        emailData.email,
        `You’ve been invited to Terralab Insets  by ${emailData.organizationName}`,
        'emails/invite_organization',
        emailData
      )

      //:: Add data in pivot table supplier_organizations
      await supplierData.related('organizations').attach({
        [reportPeriodData.organization?.toJSON().id]: {
          id: uuidv4(),
          supplier_id: [supplierData.id],
          supplier_organization_id: [null]
        },
      }, trx)

      //::commit database transaction
      await trx.commit()

      return apiResponse(
        response,
        true,
        201,
        supplierData,
        Config.get('responsemessage.SUPPLIER_RESPONSE.supplierCreateSuccess')
      )
    } catch (error) {
      //::database transaction rollback if transaction failed
      await trx.rollback()

      console.log('error', error)
      if (error.status === 422) {
        return apiResponse(
          response,
          false,
          error.status,
          error.messages,
          Config.get('responsemessage.COMMON_RESPONSE.validationFailed')
        )
      } else {
        return apiResponse(
          response,
          false,
          400,
          {},
          error.messages ? error.messages : error.message
        )
      }
    }
  }

  /**
 * Gets supplier details by ID. 
 * 
 * Authorizes the request using the SuppliersPolicy. 
 * Calculates the total scope 3 contribution value.
 * @param params 
 * @param bouncer 
 */
  public async show({ response, params, bouncer }: HttpContextContract) {
    try {
      var supplierData = await Supplier.getSupplierDetails('id', params.id)

      //:: Authorization (auth user can access only their supplier data)
      await bouncer.with('SuppliersPolicy').authorize('show', supplierData.toJSON())

      //;: Calculate total value of scope3Contribution
      let totalOfScopeContribution = 0
      let jsonFormat = JSON.parse(JSON.stringify(supplierData))
      jsonFormat.supplierProducts?.forEach((element) => {
        totalOfScopeContribution = parseFloat(
          totalOfScopeContribution + element.scope_3_contribution
        )
      })

      jsonFormat['totalOfScopeContribution'] = totalOfScopeContribution

      return apiResponse(
        response,
        true,
        200,
        jsonFormat,
        Config.get('responsemessage.COMMON_RESPONSE.getRequestSuccess')
      )
    } catch (error) {
      console.log('error', error)
      if (error.status === 422) {
        return apiResponse(
          response,
          false,
          error.status,
          error.messages,
          Config.get('responsemessage.COMMON_RESPONSE.validationFailed')
        )
      } else {
        return apiResponse(
          response,
          false,
          400,
          {},
          error.messages ? error.messages : error.message
        )
      }
    }
  }

  /**
 * Updates a supplier record by ID.
 * @param params - Route parameters containing the supplier ID to update.
 * @param auth - The authenticated user instance.  
 * @param bouncer - The authorization service instance.
 */
  public async update({ request, response, params, auth, bouncer }: HttpContextContract) {
    try {
      let requestData = request.all()

      var supplierData = await Supplier.getSupplierDetails('id', params.id)

      if (supplierData) {
        //:: Authorization (auth user can update only their supplier data)
        await bouncer.with('SuppliersPolicy').authorize('update', supplierData.toJSON())

        await request.validate(UpdateSupplierDatumValidator)

        await Supplier.updateSupplier(supplierData, requestData, auth)

        return apiResponse(
          response,
          true,
          200,
          supplierData,
          Config.get('responsemessage.SUPPLIER_RESPONSE.supplierUpdateSuccess')
        )
      }
    } catch (error) {
      console.log('error', error)
      if (error.status === 422) {
        return apiResponse(
          response,
          false,
          error.status,
          error.messages,
          Config.get('responsemessage.COMMON_RESPONSE.validationFailed')
        )
      } else {
        return apiResponse(
          response,
          false,
          400,
          {},
          error.messages ? error.messages : error.message
        )
      }
    }
  }

  public async destroy({ }: HttpContextContract) { }

  /**
 * Bulk creation of suppliers by uploading CSV file.
 * 
 * Validates CSV file format. Reads supplier data from CSV file rows. 
 * Creates unique supplier records from CSV data. Attaches suppliers to organization.
 * Sends invite emails to supplier emails. Handles database transaction commit/rollback.
 * @param auth - The authenticated user instance.
 * @param bouncer - The authorization service instance.  
 */
  public async bulkCreationOfSupplier({ request, response, auth, bouncer }: HttpContextContract) {
    //::Initialize database transaction
    const trx = await Database.transaction()

    try {
      /**
       * validation rules
       */
      const schemaRules = schema.create({
        supplierCSV: schema.file({ extnames: ['csv'] }),
        supplyChainReportingPeriodId: schema.string({ trim: true }, [
          rules.uuid(),
          rules.exists({ table: 'supply_chain_reporting_periods', column: 'id' }),
        ]),
      })

      /**
       * validation messages
       */
      let messages = {
        'supplierCSV.required': Config.get('responsemessage.SUPPLIER_RESPONSE.supplierCSVRequired'),
        'supplyChainReportingPeriodId.exists': Config.get(
          'responsemessage.SUPPLIER_RESPONSE.supplyChainReportingPeriodIdExist'
        ),
      }

      await request.validate({ schema: schemaRules, messages: messages })

      let requestData = request.all()
      //:: Fetch details of reporting period.
      var reportPeriodData = await SupplyChainReportingPeriod.getReportPeriodDetails(
        'id',
        requestData.supplyChainReportingPeriodId
      )
      //:: Authorization (auth user can create suppliers for their reporting periods only)
      await bouncer.with('SuppliersPolicy').authorize('create', reportPeriodData.toJSON())

      const csvFile: any = request.file('supplierCSV')
      const csvFilePath = csvFile ? csvFile.tmpPath : ''

      const workbook = new ExcelJS.Workbook()
      await workbook.csv.readFile(csvFilePath)

      //::There will be always one sheet in excel
      const worksheet = workbook.getWorksheet(1)

      const compareResult = await this.compareSupplierCSVFileWithTemplate(worksheet)
      if (!compareResult) {
        return apiResponse(
          response,
          false,
          422,
          {
            errors: {
              field: 'supplierCSV',
              message: Config.get('responsemessage.SUPPLIER_RESPONSE.supplierCSVNotMatch'),
            },
          },
          Config.get('responsemessage.COMMON_RESPONSE.validationFailed')
        )
      }

      //::Read sheet rows one by one
      let suppliers: any = []

      await worksheet?.eachRow(async function (row, rowNumber) {
        if (rowNumber !== 1) {
          let supplierProducts: any = []
          let productData = {
            id: uuidv4(),
            name: row.values[6] ?? null,
            type: row.values[7],
            quantity: row.values[8] ?? null,
            functionalUnit: row.values[9] ?? null,
            scope_3Contribution: row.values[10] ?? null,
          }
          supplierProducts.push(productData)

          let supplier = {
            id: uuidv4(),
            name: row.values[1] ?? null,
            email: row.values[2] ?? null,
            address: row.values[3] ?? null,
            organizationRelationship: row.values[5] ?? null,
            supplierProducts: supplierProducts,
          }

          suppliers.push(supplier)
        }
      })

      //:: Find unique entries because if supplier name same then not need to create two times.
      let uniqueSuppliers: any = []

      suppliers.forEach((currentSupplier) => {
        const existingSupplier = uniqueSuppliers.find(
          (s) => s.name === currentSupplier.name && s.email === currentSupplier.email
        )

        if (existingSupplier) {
          // Supplier with the same name already exists, merge supplierProducts
          existingSupplier.supplierProducts = [
            ...existingSupplier.supplierProducts,
            ...currentSupplier.supplierProducts,
          ]
        } else {
          // Supplier with this name doesn't exist, add as a new entry
          uniqueSuppliers.push({ ...currentSupplier })
        }
      })

      const uploadResult: any[] = []

      await Promise.all(
        await uniqueSuppliers.map(async (elementData) => {
          let data = { ...elementData }

          var supplierData = await Supplier.createSupplier(reportPeriodData, elementData, auth, trx)
          await Promise.all(
            await elementData.supplierProducts.map(async (product) => {
              var createProductData = await supplierData.related('supplierProducts').create(
                {
                  id: product.id,
                  name: product.name,
                  type: product.type,
                  quantity: product.quantity,
                  functionalUnit: product.functionalUnit,
                  scope_3Contribution: product.scope_3Contribution,
                },
                { client: trx }
              )
              return createProductData
            })
          )
          uploadResult.push(data)



          //:: Send invite mail to all suppliers
          const emailData = {
            initials: (auth.user?.firstName && auth.user?.lastName) ? auth.user?.firstName[0] + auth.user?.lastName[0] : '',
            fullName: `${auth.user?.firstName} ${auth.user?.lastName}`,
            organizationName: reportPeriodData.organization?.toJSON().company_name,
            email: elementData.email,
            url: `${WEB_BASE_URL}/register?email=${elementData.email}&isSupplier=true`,   // isSupplier required to know invited user is supplier 
          }

          await sendMail(
            emailData.email,
            `You’ve been invited to Terralab Insets  by ${emailData.organizationName}`,
            'emails/invite_organization',
            emailData
          )

          //:: Add data in pivot table supplier_organizations
          await supplierData.related('organizations').attach({
            [reportPeriodData.organization?.toJSON().id]: {
              id: uuidv4(),
              supplier_id: [supplierData.id],
              supplier_organization_id: [null]
            },
          })

          return supplierData
        })
      )

      //::commit database transaction
      await trx.commit()

      return apiResponse(
        response,
        true,
        201,
        [],
        Config.get('responsemessage.SUPPLIER_RESPONSE.bulkCreationSuccess')
      )
    } catch (error) {
      //::database transaction rollback if transaction failed
      await trx.rollback()

      console.log('err>>', error)
      if (error.status === 422) {
        return apiResponse(
          response,
          false,
          error.status,
          error.messages,
          Config.get('responsemessage.COMMON_RESPONSE.validationFailed')
        )
      } else {
        return apiResponse(
          response,
          false,
          400,
          {},
          error.messages ? error.messages : error.message
        )
      }
    }
  }

  //:: Compare two CSVs for field format
  /**
 * Compares the header row values of a given worksheet to the header row values from the supplier CSV template file.
 * Returns true if the header values match, false otherwise. Used to validate format of uploaded supplier CSV files.
 */
  private async compareSupplierCSVFileWithTemplate(worksheet) {
    const filePath = Application.publicPath('downloads/Supplier_GHG_Emissions_CSV_Template.csv')
    const csvFilePath = filePath ? filePath : ''
    const workbook = new ExcelJS.Workbook()
    await workbook.csv.readFile(csvFilePath)

    //::There will be always one sheet in excel
    const csvMainTemplate = workbook.getWorksheet(1)

    const headerRow1 = csvMainTemplate?.getRow(1).values
    const headerRow2 = worksheet.getRow(1).values

    // Compare header values
    if (JSON.stringify(headerRow1) !== JSON.stringify(headerRow2)) {
      return false
    }
    return true
  }

  /**
 * Exports supplier data for the given organization and reporting period as a CSV file.
 * 
 * Fetches the supplier data from the database for the given organization ID and reporting period ID. 
 * Creates an Excel workbook, adds a worksheet, populates it with headers and the supplier data.
 * Converts the worksheet to a CSV string, base64 encodes it, and sends it as the response.
*/
  public async exportSupplierData({ request, response }: HttpContextContract) {
    try {
      // Fetch data from the database
      const queryParams = request.qs()
      const organizationId = queryParams.organizationId
      const periodId = queryParams.supplyChainReportingPeriodId

      console.log(organizationId)
      const data = await SupplyChainReportingPeriod.query()
        .where('id', periodId)
        .andWhere('organization_id', organizationId)
        .preload('organization')
        .preload('supplier', (q) => {
          q.preload('supplierProducts')
        })
        .firstOrFail()

      // Create a new workbook and add a worksheet
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Data')

      // Add headers to the worksheet
      worksheet.addRow([
        'Supplier Name',
        'Contact Email',
        'Address',
        'Website',
        'Relationship to Organization',
        'Product Name',
        'Product Type',
        'Quantity',
        'Functional Unit',
        'Scope 3 Contribution (kgCO2)',
        'Reporting Period',
      ])

      // Add data to the worksheet
      data.supplier.forEach((supplier: Supplier) => {
        supplier.supplierProducts.forEach((product: SupplierProduct) => {
          worksheet.addRow([
            supplier?.name || '',
            supplier?.email || '',
            supplier?.address || '',
            '' || '',
            supplier?.organizationRelationship || '',
            product?.name || '',
            product?.type || '',
            product?.quantity || '',
            product?.functionalUnit || '',
            product?.scope_3Contribution || '',
            `${data?.reportingPeriodFrom.toFormat('MM/yyyy')}-${data?.reportingPeriodTo.toFormat('MM/yyyy')}`,
          ])
        })
      })

      // Convert the worksheet to a CSV string
      const csvData = await workbook.csv.writeBuffer()

      // Convert the CSV data to base64
      const base64CsvData = Buffer.from(csvData).toString('base64')

      // Set headers for the response
      const orgName = data.organization.companyName || organizationId
      const fileName = `${orgName}_suppliers_${data?.reportingPeriodFrom.toFormat('MMM')}_${data?.reportingPeriodTo.toFormat('MMM')}_${data?.reportingPeriodTo.toFormat('yyyy')}.csv`
      response.header('Content-type', 'application/csv')
      response.header('Content-disposition', `attachment; filename=${fileName}`)

      // Write the CSV data to the response
      return response.send({ csv: base64CsvData, fileName: fileName })
    } catch (error) {
      console.log(error.message)
      return apiResponse(response, false, 400, {}, error.messages ? error.messages : error.message)
    }
  }
}

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator';
import { apiResponse } from 'App/helpers/response'
import Config from '@ioc:Adonis/Core/Config';
import { v4 as uuidv4 } from 'uuid';
import ExcelJS from 'exceljs';
import Application from '@ioc:Adonis/Core/Application'
import SupplyChainReportingPeriod from 'App/Models/SupplyChainReportingPeriod';
import Supplier from 'App/Models/Supplier';
import Database from '@ioc:Adonis/Lucid/Database'
import SupplierDatumValidator from 'App/Validators/Supplier/SupplierDatumValidator';

export default class SuppliersController {
  public async index({ }: HttpContextContract) { }

  public async store({ request, response }: HttpContextContract) {
    try {
      let requestData = request.all()

      // validate facility details
      await request.validate(SupplierDatumValidator)

    } catch (error) {
      console.log("error", error)
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

  public async show({ }: HttpContextContract) { }

  public async update({ }: HttpContextContract) { }

  public async destroy({ }: HttpContextContract) { }



  //:: Create supplier data using csv file
  public async bulkCreationOfSupplier({ request, response }: HttpContextContract) {
    //::Initialize database transaction
    const trx = await Database.transaction();

    try {
      /**
      * validation rules
      */
      const schemaRules = schema.create({
        supplierCSV: schema.file({ extnames: ['csv'] }),
      })

      /**
    * validation messages
    */
      let messages = {
        'supplierCSV.required': Config.get('responsemessage.SUPPLIER_RESPONSE.supplierCSVRequired'),
      }

      await request.validate({ schema: schemaRules, messages: messages });

      let requestData = request.all()


      const csvFile: any = request.file('supplierCSV');
      const csvFilePath = csvFile ? csvFile.tmpPath : '';

      const workbook = new ExcelJS.Workbook();
      await workbook.csv.readFile(csvFilePath);

      //::There will be always one sheet in excel
      const worksheet = workbook.getWorksheet(1);

      await this.compareSupplierCSVFileWithTemplate(worksheet, response);
      //::Read sheet rows one by one

      let suppliers: any = [];
      var reportPeriodData = await SupplyChainReportingPeriod.getReportPeriodDetails('id', requestData.supplyChainReportingPeriodId);

      await worksheet?.eachRow(async function (row, rowNumber) {
        if (rowNumber !== 1) {
          let supplierProductTypes = row.values[7].split(",");
          let supplierProducts: any = []
          await supplierProductTypes.forEach(type => {
            let productData = {
              'id': uuidv4(),
              'name': row.values[6] ?? null,
              'type': type ?? null,
              'quantity': row.values[9] ?? null,
              'functionalUnit': row.values[10] ?? null,
              'scope_3Contribution': row.values[11] ?? null
            }
            supplierProducts.push(productData)
          });

          let supplier = {
            'id': uuidv4(),
            'name': row.values[1] ?? null,
            'email': row.values[2] ?? null,
            'addressLine_1': row.values[3] ?? null,
            'organizationRelationship': row.values[5] ?? null,
            'supplierProducts': supplierProducts
          };

          suppliers.push(supplier);
        }
      });

      // console.log("suppliers", suppliers)
      const uploadResult: any[] = [];

      var allPromiseData = await Promise.all(
        await suppliers.map(async (elementData) => {
          let data = { ...elementData };

          var supplierData = await Supplier.createSupplier(reportPeriodData, elementData, trx);
          await Promise.all(await elementData.supplierProducts.map(async (product) => {
            var createProductData = await supplierData.related('supplierProducts').create({
              id: product.id,
              name: product.name,
              type: product.type,
              quantity: product.quantity,
              functionalUnit: product.functionalUnit,
              scope_3Contribution: product.scope_3Contribution
            }, { client: trx });
            return createProductData;
          }))
          uploadResult.push(data);

          return supplierData
        }))

      // var getResult = await SupplyChainReportingPeriod.getReportPeriodDetails('id', requestData.supplyChainReportingPeriodId)

      //::commit database transaction
      await trx.commit();

      return apiResponse(response, true, 201, [],
        Config.get('responsemessage.SUPPLIER_RESPONSE.bulkCreationSuccess'))

  } catch(error) {

    //::database transaction rollback if transaction failed
    await trx.rollback();

    console.log("err>>", error)
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
  private async compareSupplierCSVFileWithTemplate(worksheet, response) {
  const filePath = Application.publicPath('downloads/Supplier CSV Template.csv');
  const csvFilePath = filePath ? filePath : '';
  const workbook = new ExcelJS.Workbook();
  await workbook.csv.readFile(csvFilePath);

  //::There will be always one sheet in excel
  const csvMainTemplate = workbook.getWorksheet(1);

  const headerRow1 = csvMainTemplate?.getRow(1).values;
  const headerRow2 = worksheet.getRow(1).values;
  console.log("row", JSON.stringify(headerRow1))
  console.log("row2", JSON.stringify(headerRow2))


  // Compare header values
  if (JSON.stringify(headerRow1) !== JSON.stringify(headerRow2)) {
    return apiResponse(response, false, 422, {
      'errors': {
        "field": "supplierCSV",
        "message": Config.get('responsemessage.SUPPLIER_RESPONSE.supplierCSVNotMatch')
      }
    }, Config.get('responsemessage.COMMON_RESPONSE.validationFailed'))
  }
  return;
}

}


import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { apiResponse } from 'App/helpers/response'
import Config from '@ioc:Adonis/Core/Config';
import { v4 as uuidv4 } from 'uuid';
import Organization from 'App/Models/Organization'
import ExcelJS from 'exceljs';
import Application from '@ioc:Adonis/Core/Application'



export default class SuppliersController {
  public async index({ }: HttpContextContract) { }

  public async store({ }: HttpContextContract) { }

  public async show({ }: HttpContextContract) { }

  public async update({ }: HttpContextContract) { }

  public async destroy({ }: HttpContextContract) { }



  //:: Create supplier data using csv file
  public async bulkCreationOfSupplier({ request, response }: HttpContextContract) {
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

      const csvFile: any = request.file('supplierCSV');
      const csvFilePath = csvFile ? csvFile.tmpPath : '';

      const workbook = new ExcelJS.Workbook();
      await workbook.csv.readFile(csvFilePath);

      //::There will be always one sheet in excel
      const worksheet = workbook.getWorksheet(1);

      await this.compareSupplierCSVFileWithTemplate(worksheet);
      //::Read sheet rows one by one
      await worksheet?.eachRow(async function (row, rowNumber) {
        console.log("row", row.values[1])
        // if (rowNumber !== 1) {
        //   let user: any = {
        //     'name': row.values[1] ?? null,
        //     'email': row.values[2] ?? null,
        //     'contact_number': row.values[3] ?? null,
        //     'bio': row.values[4] ?? null,
        //     'note': row.values[5] ?? null,
        //   };
        //   users.push(user);
        // }
      });

    }
    catch (error) {
      console.log("err>>", error)
      return apiResponse(response, false, error.status, { "errors": error.message });

    }
  }



  private async compareSupplierCSVFileWithTemplate(worksheet) {
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
        console.log(`Header values in sheet "" are different.`);
        return;
    }


  }

}


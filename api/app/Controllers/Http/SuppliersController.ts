import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { apiResponse } from 'App/helpers/response'
import Config from '@ioc:Adonis/Core/Config';
import { v4 as uuidv4 } from 'uuid';
import ExcelJS from 'exceljs';
import Application from '@ioc:Adonis/Core/Application'
import SupplyChainReportingPeriod from 'App/Models/SupplyChainReportingPeriod';
import Supplier from 'App/Models/Supplier';
import Database from '@ioc:Adonis/Lucid/Database'
import AddSupplierDatumValidator from 'App/Validators/Supplier/AddSupplierDatumValidator';
import UpdateSupplierDatumValidator from 'App/Validators/Supplier/UpdateSupplierDatumValidator';

export default class SuppliersController {
  public async index({ request, response }: HttpContextContract) {
    try {
      const queryParams = request.qs();

      const allSuppliersData = await Supplier.getAllSuppliersForSpecificPeriod(queryParams);

      const isPaginated = !request.input('perPage') || request.input('perPage') !== 'all';

      return apiResponse(response, true, 200, allSuppliersData, Config.get('responsemessage.COMMON_RESPONSE.getRequestSuccess'), isPaginated);

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

  public async store({ request, response }: HttpContextContract) {
    try {
      let requestData = request.all()

      await request.validate(AddSupplierDatumValidator);
      var reportPeriodData = await SupplyChainReportingPeriod.getReportPeriodDetails('id', requestData.supplyChainReportingPeriodId);

      requestData = { ...requestData, id: uuidv4() }
      var supplierData = await Supplier.createSupplier(reportPeriodData, requestData);

      return apiResponse(response, true, 201, supplierData,
        Config.get('responsemessage.SUPPLIER_RESPONSE.supplierCreateSuccess'))


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

  public async update({ request, response, params }: HttpContextContract) {
    try {
      let requestData = request.all()

      var supplierData = await Supplier.getSupplierDetails('id', params.id);

      if (supplierData) {
        await request.validate(UpdateSupplierDatumValidator);

        await Supplier.updateSupplier(supplierData, requestData)

        return apiResponse(response, true, 200, supplierData,
          Config.get('responsemessage.SUPPLIER_RESPONSE.supplierUpdateSuccess'))

      }
    }
    catch (error) {
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
        'supplyChainReportingPeriodId.exists': Config.get('responsemessage.SUPPLIER_RESPONSE.supplyChainReportingPeriodIdExist'),
      }

      await request.validate({ schema: schemaRules, messages: messages });

      let requestData = request.all()


      const csvFile: any = request.file('supplierCSV');
      const csvFilePath = csvFile ? csvFile.tmpPath : '';

      const workbook = new ExcelJS.Workbook();
      await workbook.csv.readFile(csvFilePath);

      //::There will be always one sheet in excel
      const worksheet = workbook.getWorksheet(1);

      const compareResult = await this.compareSupplierCSVFileWithTemplate(worksheet);
      if (!compareResult) {
        return apiResponse(response, false, 422, {
          'errors': {
            "field": "supplierCSV",
            "message": Config.get('responsemessage.SUPPLIER_RESPONSE.supplierCSVNotMatch')
          }
        }, Config.get('responsemessage.COMMON_RESPONSE.validationFailed'))
      }


      //::Read sheet rows one by one
      let suppliers: any = [];
      var reportPeriodData = await SupplyChainReportingPeriod.getReportPeriodDetails('id', requestData.supplyChainReportingPeriodId);

      await worksheet?.eachRow(async function (row, rowNumber) {
        if (rowNumber !== 1) {
          // let supplierProductTypes = row.values[7].split(",");
          let supplierProducts: any = []
          // await supplierProductTypes.forEach(type => {
          let productData = {
            'id': uuidv4(),
            'name': row.values[6] ?? null,
            'type': row.values[7],
            // 'type': type ?? null,
            'quantity': row.values[8] ?? null,
            'functionalUnit': row.values[9] ?? null,
            'scope_3Contribution': row.values[10] ?? null
          }
          supplierProducts.push(productData)
          // });

          let supplier = {
            'id': uuidv4(),
            'name': row.values[1] ?? null,
            'email': row.values[2] ?? null,
            'address': row.values[3] ?? null,
            'organizationRelationship': row.values[5] ?? null,
            'supplierProducts': supplierProducts
          };

          suppliers.push(supplier);
        }
      });


      //:: Find unique entries because if supplier name same then not need to create two times.
      let uniqueSuppliers: any = []

      suppliers.forEach((currentSupplier) => {
        const existingSupplier = uniqueSuppliers.find(
          (s) => (s.name === currentSupplier.name && s.email === currentSupplier.email)
        );

        if (existingSupplier) {
          // Supplier with the same name already exists, merge supplierProducts
          existingSupplier.supplierProducts = [
            ...existingSupplier.supplierProducts,
            ...currentSupplier.supplierProducts,
          ];
        } else {
          // Supplier with this name doesn't exist, add as a new entry
          uniqueSuppliers.push({ ...currentSupplier });
        }
      });

      const uploadResult: any[] = [];

      await Promise.all(
        await uniqueSuppliers.map(async (elementData) => {
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

      //::commit database transaction
      await trx.commit();

      return apiResponse(response, true, 201, [],
        Config.get('responsemessage.SUPPLIER_RESPONSE.bulkCreationSuccess'))

    } catch (error) {

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
  private async compareSupplierCSVFileWithTemplate(worksheet) {
    const filePath = Application.publicPath('downloads/Supplier CSV Template.csv');
    const csvFilePath = filePath ? filePath : '';
    const workbook = new ExcelJS.Workbook();
    await workbook.csv.readFile(csvFilePath);

    //::There will be always one sheet in excel
    const csvMainTemplate = workbook.getWorksheet(1);

    const headerRow1 = csvMainTemplate?.getRow(1).values;
    const headerRow2 = worksheet.getRow(1).values;

    // Compare header values
    if (JSON.stringify(headerRow1) !== JSON.stringify(headerRow2)) {
      return false
    }
    return true;
  }

}


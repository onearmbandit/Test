import Application from '@ioc:Adonis/Core/Application'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { apiResponse } from 'App/helpers/response'



export default class FilesController {
    async download({ response,params }: HttpContextContract) {
        const filePath = Application.publicPath(`downloads/${params.fileName}`);
        return response.download(filePath)
    }


    async downloadSupplierCSV({ response }: HttpContextContract){
        let data={
            'download_url': `${process.env.APP_URL}/download/Supplier_GHG_Emissions_CSV_Template.csv`
        }

        return apiResponse(
            response,
            true,
            200,
            data,
          )
    }
}

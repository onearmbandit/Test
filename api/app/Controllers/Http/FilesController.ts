import Application from '@ioc:Adonis/Core/Application'
// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'



export default class FilesController {
    async download({ response }) {
        const filePath = Application.publicPath('downloads/Supplier CSV Template.csv');

        console.log("filePath", filePath)
        return response.download(filePath)
    }

}

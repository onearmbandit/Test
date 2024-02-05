import Application from '@ioc:Adonis/Core/Application'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { apiResponse } from 'App/helpers/response'
import Config from '@ioc:Adonis/Core/Config';
import ImageUploadValidator from 'App/Validators/FileUpload/ImageUploadValidator';
import Env from '@ioc:Adonis/Core/Env'

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import fs from 'fs';
import Drive from '@ioc:Adonis/Core/Drive'


export default class FilesController {
    async download({ response, params }: HttpContextContract) {
        const filePath = Application.publicPath(`downloads/${params.fileName}`);
        return response.download(filePath)
    }


    async downloadSupplierCSV({ response }: HttpContextContract) {
        let data = {
            'download_url': `${Env.get('APP_URL')}/download/Supplier_GHG_Emissions_CSV_Template.csv`
        }

        return apiResponse(
            response,
            true,
            200,
            data,
        )
    }


    //:: Upload image to s3 bucket
    public async uploadImageToS3({ request, response }: HttpContextContract) {
        try {

            var payload = await request.validate(ImageUploadValidator);

            // * File upload using aws-sdk library
            const bucket = Env.get('AWS_BUCKET')
            const accessKeyId = Env.get('AWS_ACCESS_KEY_ID')
            const secretAccessKey = Env.get('AWS_SECRET_ACCESS_KEY')
            const region = Env.get('AWS_DEFAULT_REGION')
            if (bucket && accessKeyId && secretAccessKey && payload.image.tmpPath) {
                // Set your AWS credentials and region
                const s3Client = new S3Client({
                    region:
                        Env.get('AWS_DEFAULT_REGION'),
                    credentials: {
                        accessKeyId: accessKeyId,
                        secretAccessKey: secretAccessKey,
                    },
                })

                const uploadedImage = {
                    Bucket: bucket,
                    Key: payload.image.clientName,
                    Body: fs.readFileSync(payload.image.tmpPath),
                    Metadata: {
                        'Content-Disposition': 'inline',
                    }
                }

                const command = new PutObjectCommand(uploadedImage)
                const result = await s3Client.send(command)

                if (result.$metadata.httpStatusCode === 200) {

                    // const ImageUrl = Env.get('AWS_ENDPOINT') + '/' + uploadedImage.Key

                    const ImageUrl = `https://${bucket}.s3.${region}.amazonaws.com/${uploadedImage.Key}`;

                    //store url into database
                    return apiResponse(response, true, 201, { 'url': ImageUrl },
                        Config.get('responsemessage.FILE_UPLOAD_RESPONSE.uploadSuccess'));
                }
            } else {
                return apiResponse(response, false, 400, {}, Config.get('responsemessage.FILE_UPLOAD_RESPONSE.serverError'))
            }

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
}

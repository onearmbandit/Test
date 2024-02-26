import Application from '@ioc:Adonis/Core/Application'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { apiResponse } from 'App/helpers/response'
import ImageUploadValidator from 'App/Validators/FileUpload/ImageUploadValidator';
import Env from '@ioc:Adonis/Core/Env'

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import fs from 'fs';


export default class FilesController {

  /**
 * Downloads a file from the public/downloads folder.
 * 
 * @param response - The HTTP response to send the file download on.
 * @param params.fileName - The name of the file in the downloads folder to download.
 */
  async download({ response, params }: HttpContextContract) {
    const filePath = Application.publicPath(`downloads/${params.fileName}`);
    return response.download(filePath)
  }

  /**
 * Returns a download URL for a sample supplier CSV template file.
 * 
 * Sends back a JSON response with a `download_url` property containing the URL.
 */
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



  /**
 * Uploads an image to AWS S3.
 * 
 * Validates the image upload using the ImageUploadValidator. 
 * Configures the S3 client with credentials. 
 * Uploads the image file to S3.
 * Returns the uploaded file URL on success.
 */
  public async uploadImageToS3({ request, response }: HttpContextContract) {
    try {

      // const uploadFile = request.file('image')
      var payload = await request.validate(ImageUploadValidator);

      //using aws-sdk
      const bucket = process.env.S3_BUCKET
      const accessKeyId = process.env.S3_ACCESS_KEY_ID
      const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY

      if (bucket && accessKeyId && secretAccessKey) {
        // Set your AWS credentials and region
        const s3Client = new S3Client({
          region: process.env.S3_DEFAULT_REGION,
          credentials: {
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
          },
        })

        var content = this.getMimeType(payload.image);

        const command = new PutObjectCommand({
          Bucket: bucket,
          Key: payload.image.clientName,
          Body: fs.readFileSync(payload.image.tmpPath!),
          ContentType: content,
        });

        const result = await s3Client.send(command)
        var uploadedFileUrl

        if (result.$metadata.httpStatusCode === 200) {
          uploadedFileUrl = process.env.CLOUDFRONT_URL + '/' + payload.image.clientName;
        }
      }

      return apiResponse(response, true, 200, uploadedFileUrl, 'Files uploaded successfully')
    } catch (error) {
      return apiResponse(response, false, 400, {}, error.message)
    }
  }

  public getMimeType = (file) => {
    if (file.extname && file.type) {
      return `${file.type}/${file.extname}`;
    } else {
      return 'application/octet-stream';
    }
  }
}


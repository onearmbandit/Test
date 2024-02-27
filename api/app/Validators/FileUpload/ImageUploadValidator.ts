import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ImageUploadValidator {
  constructor (protected ctx: HttpContextContract) {
  }


  /**
 * Defines a schema for validating uploaded image files.
 * 
 * Limits image size to 10mb and allowed extensions to common image formats.
 */
  public schema = schema.create({
    image: schema.file({
      size: '10mb',
      extnames: ['jpg', 'png', 'jpeg', 'svg', 'webp', 'bmp'],
    }),
  })


  public messages = {
	'file.size': 'The file size must be under {{ options.size }}',
	'file.extname': 'The file must have one of {{ options.extnames }} extension names',
  }
}

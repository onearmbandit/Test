import { ResponseObject } from '../../contracts/interfaces/types'
import { ResponseContract } from '@ioc:Adonis/Core/Response'

export const apiResponse = (
  res: ResponseContract,
  status: boolean,
  code: number,
  data: ResponseObject = {},
  description: string = '',
  isPaginated: boolean = false
) => {
  let response: ResponseObject = {
    status: status,
    code: code,
    message: description,
  }

  if (code >= 200 && code < 300) {
    if (isPaginated) {
      let finalData = data.toJSON()
      response.meta = finalData.meta
      response.data = finalData.data
    } else {
      response.data = data
    }
  } else if (data.errors) {
    response.errors = data.errors
  }
  return res.status(code).json(response)
}


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

      // Check if equalityAttribute exists in data and add it to response.data
      if (data.equalityAttributes !== undefined) {
        response.data['equalityAttributes'] = data.equalityAttributes;
      }
    } else {
      response.data = data

      // Check if equalityAttribute exists in data and add it to response.data
      if (data.equalityAttributes !== undefined) {
        response.data['equalityAttributes'] = data.equalityAttributes;
      }
    }
  } else if (data.errors) {
    response.errors = data.errors
  }

  // console.log("response.data >>>", response)
  return res.status(code).json(response)
}


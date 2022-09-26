import { HttpContext } from '@adonisjs/core/build/standalone'
import Instituition from 'App/Models/Instituition'
import CreateInstituitionValidator from 'App/Validators/CreateInstituitionValidator'
// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class InstituitionsController {
  public async store({ request, response }: HttpContext) {
    const instituitionPayLoad = await request.validate(CreateInstituitionValidator)

    const instituition = await Instituition.create(instituitionPayLoad)
    return response.created({ instituition })
  }
}

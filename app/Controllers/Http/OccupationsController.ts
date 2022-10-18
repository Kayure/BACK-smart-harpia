import { HttpContext } from '@adonisjs/core/build/standalone'
import Occupation from 'App/Models/Occupation'
import CreateOccupationValidator from 'App/Validators/CreateOccupationValidator'

// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class OccupationsController {
  public async store({ request, response }: HttpContext) {
    const occupationPayLoad = await request.validate(CreateOccupationValidator)

    const occupation = await Occupation.create(occupationPayLoad)
    return response.created({ occupation })
  }
}

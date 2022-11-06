import { HttpContext } from '@adonisjs/core/build/standalone'
import Occupation from 'App/Models/Occupation'
import CreateOccupationValidator from 'App/Validators/CreateOccupationValidator'
import UpdateOccupationValidator from 'App/Validators/UpdateOccupationValidator'

// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class OccupationsController {
  public async store({ request, response }: HttpContext) {
    const occupationPayLoad = await request.validate(CreateOccupationValidator)

    const occupation = await Occupation.create(occupationPayLoad)
    return response.created({ occupation })
  }

  public async update({ request, response }: HttpContext) {
    const { name, description } = await request.validate(UpdateOccupationValidator)
    const id = request.param('id')

    const occupation = await Occupation.findOrFail(id)

    occupation.name = name
    occupation.description = description

    occupation.save()

    return response.ok({ occupation })
  }

  public async destroy({ request, response }: HttpContext) {
    const id = request.param('id')

    const occupation = await Occupation.findOrFail(id)
    occupation.delete()

    return response.noContent()
  }

  public async read({ response }: HttpContext) {
    const occupations = await Occupation.all()

    return response.ok({ occupations })
  }
}

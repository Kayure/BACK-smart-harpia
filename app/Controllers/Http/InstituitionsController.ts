import { HttpContext } from '@adonisjs/core/build/standalone'
import Instituition from 'App/Models/Instituition'
import CreateInstituitionValidator from 'App/Validators/CreateInstituitionValidator'
import UpdateInstituitionValidator from 'App/Validators/UpdateInstituitionValidator'

// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class InstituitionsController {
  public async store({ request, response }: HttpContext) {
    const instituitionPayLoad = await request.validate(CreateInstituitionValidator)

    const instituition = await Instituition.create(instituitionPayLoad)
    return response.created({ instituition })
  }

  public async update({ request, response }: HttpContext) {
    const { name, abbreviation } = await request.validate(UpdateInstituitionValidator)
    const id = request.param('id')

    const instituition = await Instituition.findOrFail(id)

    instituition.name = name
    instituition.abbreviation = abbreviation

    instituition.save()

    return response.ok({ instituition })
  }

  public async destroy({ request, response }: HttpContext) {
    const id = request.param('id')

    const instituition = await Instituition.findOrFail(id)
    instituition.delete()

    return response.noContent()
  }

  public async read({ response }: HttpContext) {
    const instituitions = await Instituition.all()

    return response.ok({ instituitions })
  }
}

import { HttpContext } from '@adonisjs/core/build/standalone'
import City from 'App/Models/City'
import Instituition from 'App/Models/Instituition'
import Local from 'App/Models/Local'
import CreateLocalValidator from 'App/Validators/CreateLocalValidator'
import UpdateLocalValidator from 'App/Validators/UpdateLocalValidator'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LocalsController {
  public async store({ request, response }: HttpContext) {
    const localPayLoad = await request.validate(CreateLocalValidator)

    const local = await Local.create(localPayLoad)

    const instituition = await Instituition.findOrFail(localPayLoad.instituition)
    await local.related('instituition').associate(instituition)

    const city = await City.findOrFail(localPayLoad.city)
    await local.related('city').associate(city)

    return response.created({ local })
  }

  public async update({ request, response, bouncer }: HttpContextContract) {
    const { name, city, instituition } = await request.validate(UpdateLocalValidator)
    const id = request.param('id')
    const local = await Local.findOrFail(id)

    await bouncer.authorize('updateLocal', local)

    const newCity = await City.findOrFail(city)
    await local.related('city').associate(newCity)

    const newInstituition = await Instituition.findOrFail(instituition)
    await local.related('instituition').associate(newInstituition)

    local.name = name

    await local.save()

    return response.ok({ local })
  }

  public async destroy({ request, response }: HttpContext) {
    const id = request.param('id')

    const local = await Local.findOrFail(id)
    await local.delete()

    return response.noContent()
  }

  public async read({ response }: HttpContext) {
    const locals = await Local.all()

    return response.ok({ locals })
  }
}

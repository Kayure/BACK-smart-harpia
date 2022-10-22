import { HttpContext } from '@adonisjs/core/build/standalone'
import City from 'App/Models/City'
import Local from 'App/Models/Local'
import CreateLocalValidator from 'App/Validators/CreateLocalValidator'
import UpdateLocalValidator from 'App/Validators/UpdateLocalValidator'

// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LocalsController {
  public async store({ request, response }: HttpContext) {
    const localPayLoad = await request.validate(CreateLocalValidator)

    const local = await Local.create(localPayLoad)

    const city = await City.findOrFail(localPayLoad.city)
    await local.related('city').associate(city)

    return response.created({ local })
  }

  public async update({ request, response }: HttpContext) {
    const { name, description, latitude, longitude, city } = await request.validate(
      UpdateLocalValidator
    )
    const id = request.param('id')
    const local = await Local.findOrFail(id)

    local.name = name
    local.description = description
    local.latitude = latitude
    local.longitude = longitude

    const newCity = await City.findOrFail(city)
    await local.related('city').associate(newCity)

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

import { HttpContext } from '@adonisjs/core/build/standalone'
import Map from 'App/Models/Map'
import CreateMapValidator from 'App/Validators/CreateMapValidator'
import UpdateMapValidator from 'App/Validators/UpdateMapValidator'

// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class MapsController {
  public async store({ request, response }: HttpContext) {
    const mapPayLoad = await request.validate(CreateMapValidator)

    const map = await Map.create(mapPayLoad)

    return response.created({ map })
  }

  public async update({ request, response }: HttpContext) {
    const { latitude, longitude } = await request.validate(UpdateMapValidator)
    const id = request.param('id')
    const map = await Map.findOrFail(id)

    map.latitude = latitude
    map.longitude = longitude
    await map.save()

    return response.ok({ map })
  }

  public async destroy({ request, response }: HttpContext) {
    const id = request.param('id')

    const map = await Map.findOrFail(id)
    await map.delete()

    return response.noContent()
  }

  public async read({ request, response }: HttpContext) {
    const maps = await Map.all()

    return response.ok({ maps })
  }
}

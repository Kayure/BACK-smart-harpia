import { HttpContext } from '@adonisjs/core/build/standalone'
import Local from 'App/Models/Local'
import Log from 'App/Models/Log'
import Mdev from 'App/Models/Mdev'
import CreateMdevValidator from 'App/Validators/CreateMdevValidator'
import UpdateMdevValidator from 'App/Validators/UpdateMdevValidator'

// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class MdevsController {
  public async store({ request, response }: HttpContext) {
    const mdevPayLoad = await request.validate(CreateMdevValidator)

    const mdev = await Mdev.create(mdevPayLoad)

    const local = await Local.findOrFail(mdevPayLoad.local)
    await mdev.related('local').associate(local)

    return response.created({ mdev })
  }

  public async update({ request, response }: HttpContext) {
    const { name, nickname, latitude, longitude, local, active } = await request.validate(
      UpdateMdevValidator
    )

    const id = request.param('id')
    const mdev = await Mdev.findOrFail(id)

    mdev.name = name
    mdev.latitude = latitude
    mdev.longitude = longitude
    mdev.active = active

    if (nickname !== undefined) mdev.nickname = nickname

    const newLocal = await Local.findOrFail(local)
    await mdev.related('local').associate(newLocal)

    await mdev.save()

    return response.ok({ mdev })
  }

  public async destroy({ request, response }: HttpContext) {
    const id = request.param('id')

    const mdev = await Mdev.findOrFail(id)
    await mdev.delete()

    return response.noContent()
  }

  public async read({ response }: HttpContext) {
    const mdevs = await Mdev.all()

    return response.ok({ mdevs })
  }

  public async reset({ request, response }: HttpContext) {
    const id = request.param('id')

    //const mdev = await Mdev.findOrFail(id)

    await Log.query()
      .where('mdev_id', id)
      .andWhereNull('leaved_at')
      .update({ leaved_at: new Date(), reseted: true })

    return response.noContent()
  }
}

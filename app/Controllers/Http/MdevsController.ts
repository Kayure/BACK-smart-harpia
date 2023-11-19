import { HttpContext } from '@adonisjs/core/build/standalone'
import Local from 'App/Models/Local'
import Log from 'App/Models/Log'
import Mdev from 'App/Models/Mdev'
import CreateMdevValidator from 'App/Validators/CreateMdevValidator'
import UpdateMdevValidator from 'App/Validators/UpdateMdevValidator'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Device from 'App/Models/Device'

export default class MdevsController {
  // Método para criar um dispositivo Mdev
  public async store({ request, response }: HttpContext) {
    const mdevPayLoad = await request.validate(CreateMdevValidator)

    const mdev = await Mdev.create(mdevPayLoad)

    const local = await Local.findOrFail(mdevPayLoad.local)
    await mdev.related('local').associate(local)

    return response.created({ mdev })
  }

  // Método para atualizar um dispositivo Mdev existente
  public async update({ request, response, bouncer }: HttpContextContract) {
    const { name, latitude, longitude, local, active, imagePath, signalStrength } =
      await request.validate(UpdateMdevValidator)

    const id = request.param('id')
    const mdev = await Mdev.findOrFail(id)

    await bouncer.authorize('updateMdev', mdev)

    // Atualizar os campos do dispositivo Mdev
    if (imagePath) {
      mdev.imagePath = imagePath
    } else {
      mdev.imagePath = ''
    }
    if (signalStrength !== undefined) mdev.signalStrength = signalStrength

    mdev.name = name
    mdev.latitude = latitude
    mdev.longitude = longitude
    mdev.active = active

    const newLocal = await Local.findOrFail(local)
    await mdev.related('local').associate(newLocal)

    await mdev.save()

    return response.ok({ mdev })
  }

  // Método para excluir um dispositivo Mdev
  public async destroy({ request, response }: HttpContext) {
    const id = request.param('id')

    const mdev = await Mdev.findOrFail(id)
    await mdev.delete()

    return response.noContent()
  }

  // Método para recuperar todos os dispositivos Mdev
  public async read({ response }: HttpContext) {
    const mdevs = await Mdev.all()

    return response.ok({ mdevs })
  }

  // Método para recuperar um dispositivo Mdev por ID
  public async getMdevByID({ request, response }: HttpContext) {
    const id = request.param('id')

    const mdev = await Mdev.findOrFail(id)

    return response.ok({ mdev })
  }

  // Método para redefinir logs em aberto após um Mdev ter perdido a conexão
  public async reset({ request, response }: HttpContext) {
    const id = request.param('id')

    // Atualiza os registros de log relacionados a este dispositivo Mdev
    await Log.query()
      .where('mdev_id', id)
      .andWhereNull('leaved_at')
      .update({ leaved_at: new Date(), reseted: 1 })

    return response.noContent()
  }

  // Retorna todos devices associados ao mdev
  public async getMdevDevicesById({ request, response }: HttpContext) {
    const id = request.param('id')

    const devices = await Device.query().where('mdev_id', id)

    return response.ok({ devices })
  }
}

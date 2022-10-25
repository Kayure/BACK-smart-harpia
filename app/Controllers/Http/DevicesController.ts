import { HttpContext } from '@adonisjs/core/build/standalone'
import Device from 'App/Models/Device'
import Mdev from 'App/Models/Mdev'
import CreateDeviceValidator from 'App/Validators/CreateDeviceValidator'
import UpdateDeviceValidator from 'App/Validators/UpdateDeviceValidator'

// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class DevicesController {
  public async store({ request, response }: HttpContext) {
    const devicePayLoad = await request.validate(CreateDeviceValidator)

    const device = await Device.create(devicePayLoad)

    const mdev = await Mdev.findOrFail(devicePayLoad.mdevId)
    await device.related('mdev').associate(mdev)

    return response.created({ device })
  }

  public async update({ request, response }: HttpContext) {
    const { macAddress, name, mdevId } = await request.validate(UpdateDeviceValidator)

    const id = request.param('id')
    const device = await Device.findOrFail(id)

    device.macAddress = macAddress
    device.mdevId = mdevId

    if (name !== undefined) device.name = name

    const newMdev = await Mdev.findOrFail(mdevId)
    await device.related('mdev').associate(newMdev)

    await device.save()

    return response.ok({ device })
  }

  public async destroy({ request, response }: HttpContext) {
    const id = request.param('id')

    const device = await Device.findOrFail(id)
    await device.delete()

    return response.noContent()
  }

  public async read({ response }: HttpContext) {
    const devices = await Device.all()

    return response.ok({ devices })
  }
}

import { HttpContext } from '@adonisjs/core/build/standalone'
import { string } from '@ioc:Adonis/Core/Helpers'
import Device from 'App/Models/Device'
import Mdev from 'App/Models/Mdev'
import CreateDeviceValidator from 'App/Validators/CreateDeviceValidator'
import UpdateDeviceValidator from 'App/Validators/UpdateDeviceValidator'

export default class DevicesController {
  // Método para criar um novo dispositivo
  public async store({ request, response }: HttpContext) {
    const devicePayLoad = await request.validate(CreateDeviceValidator)

    const device = await Device.create(devicePayLoad)

    const mdev = await Mdev.findOrFail(devicePayLoad.mdevId)
    await device.related('mdev').associate(mdev)

    return response.created({ device })
  }

  // Método para atualizar um dispositivo existente
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

  // Método para excluir um dispositivo
  public async destroy({ request, response }: HttpContext) {
    const id = request.param('id')

    const device = await Device.findOrFail(id)
    await device.delete()

    return response.noContent()
  }

  // Método para obter todos os dispositivos
  public async read({ response }: HttpContext) {
    const devices = await Device.all()

    return response.ok({ devices })
  }

  // Método para obter um dispositivo por ID
  public async getDeviceByID({ request, response }: HttpContext) {
    const id = request.param('id')

    const device = await Device.findOrFail(id)

    return response.ok({ device })
  }

  // Método para apagar um edndereço Mac de um dispositivo por endereço MAC
  public async deleteMacByMac({ request, response }: HttpContext) {
    const macAddress = request.param('macAddress').toString()

    const device = await Device.findByOrFail('macAddress', macAddress)

    device.macAddress =
      'Endereço MAC deletado por motivos de privacidade. ' + string.generateRandom(32)

    device.save()

    return response.ok({ device })
  }
}

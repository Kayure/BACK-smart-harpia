import { HttpContext } from '@adonisjs/core/build/standalone'
import Database from '@ioc:Adonis/Lucid/Database'
import Device from 'App/Models/Device'
import Log from 'App/Models/Log'
import Mdev from 'App/Models/Mdev'
import CreateLogValidator from 'App/Validators/CreateLogValidator'
import UpdateLogValidator from 'App/Validators/UpdateLogValidator'
import { DateTime } from 'luxon'

export default class LogsController {
  // Método para armazenar um novo log
  public async store({ request, response }: HttpContext) {
    const logPayload = await request.validate(CreateLogValidator)

    // Verificar se o dispositivo já existe, senão criar um
    let device = await Device.query()
      .where('macAddress', logPayload.macAddress)
      .andWhere('mdevId', logPayload.mdevId)
      .first()

    if (device === null) {
      device = await Device.create({
        mdevId: logPayload.mdevId,
        macAddress: logPayload.macAddress,
      })
    }

    const log = await Log.create({
      deviceId: device!.id,
    })

    await log.related('device').associate(device!)

    const mdev = await Mdev.findOrFail(logPayload.mdevId)
    await log.related('mdev').associate(mdev)

    return response.created({ log })
  }

  // Método para atualizar um log
  public async update({ request, response }: HttpContext) {
    const logPayload = await request.validate(UpdateLogValidator)

    // Procurar o dispositivo e log correspondente
    const device = await Device.query()
      .where('macAddress', logPayload.macAddress)
      .andWhere('mdevId', logPayload.mdevId)
      .firstOrFail()

    const log = await Log.query()
      .where('deviceId', device.id)
      .andHavingNull('leavedAt')
      .firstOrFail()

    //Marca o horário de saída
    log.leavedAt = DateTime.now()

    await log.save()

    return response.ok({ log })
  }

  // Método para listar logs por Mdev
  public async listByMdev({ request, response }: HttpContext) {
    const id = request.param('id')
    const { realtime } = request.qs()

    const mdev = await Mdev.findOrFail(id)
    if (realtime) {
      await mdev.load('logs', (logQuery) => {
        logQuery.whereNull('leaved_at').preload('device')
      })
    } else {
      await mdev.load('logs', (loader) => {
        loader.preload('device')
      })
    }

    return response.ok(mdev)
  }

  // Método para gerar um relatório
  public async generateReport({ response }: HttpContext) {
    try {
      const data = await Database.query()
        .select(
          'mdev_id',
          Database.raw('HOUR(entered_at) AS hourEntered'),
          Database.raw('COUNT(DISTINCT device_id) AS uniqueDeviceCount')
        )
        .from('logs')
        .whereRaw('entered_at >= NOW() - INTERVAL 24 HOUR')
        .groupBy('mdev_id', 'hourEntered')
        .orderBy('mdev_id')
        .orderBy('hourEntered')

      const groupedData = this.groupDataByMdevId(data)

      return response.ok(groupedData)
    } catch (error) {
      return response.badRequest({ message: 'No data found' })
    }
  }

  // Método privado para agrupar dados por mdev_id
  private groupDataByMdevId(data: any[]) {
    return data.reduce((result, { mdev_id, hourEntered, uniqueDeviceCount }) => {
      if (!result[mdev_id]) {
        result[mdev_id] = []
      }
      result[mdev_id].push({ hourEntered, uniqueDeviceCount })
      return result
    }, {})
  }
}

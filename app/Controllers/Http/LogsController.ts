import { HttpContext } from '@adonisjs/core/build/standalone'
import Database from '@ioc:Adonis/Lucid/Database'
import Device from 'App/Models/Device'
import Log from 'App/Models/Log'
import Mdev from 'App/Models/Mdev'
import CreateLogValidator from 'App/Validators/CreateLogValidator'
import UpdateLogValidator from 'App/Validators/UpdateLogValidator'
import { DateTime } from 'luxon'

// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LogsController {
  public async store({ request, response }: HttpContext) {
    const logPayLoad = await request.validate(CreateLogValidator)

    //Create a device if not exits
    let device = await Device.query()
      .where('macAddress', logPayLoad.macAddress)
      .andWhere('mdevId', logPayLoad.mdevId)
      .first()

    if (device === null) {
      device = await Device.create({
        mdevId: logPayLoad.mdevId,
        macAddress: logPayLoad.macAddress,
      })
    }

    const log = await Log.create({
      deviceId: device!.id,
    })

    await log.related('device').associate(device!)

    const mdev = await Mdev.findOrFail(logPayLoad.mdevId)
    await log.related('mdev').associate(mdev)

    return response.created({ log })
  }

  public async update({ request, response }: HttpContext) {
    const logPayLoad = await request.validate(UpdateLogValidator)

    const device = await Device.query()
      .where('macAddress', logPayLoad.macAddress)
      .andWhere('mdevId', logPayLoad.mdevId)
      .firstOrFail()

    const log = await Log.query()
      .where('deviceId', device.id)
      .andHavingNull('leavedAt')
      .firstOrFail()

    log.leavedAt = DateTime.now()

    log.save()

    return response.ok({ log })
  }

  /*   public async listByMdev({ request, response }: HttpContext) {
    const id = request.param('id')
    const { realtime } = request.qs()

    let logs: Log[]
    if (realtime) {
      logs = await Log.query().where('mdevId', id).andWhereNull('leaved_at').preload('device')
    } else {
      logs = await Log.query().where('mdevId', id).preload('device')
    }

    return response.ok({ logs })
  } */

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

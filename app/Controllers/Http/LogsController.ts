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
    let { realtime, page } = request.qs()

    if (!page) page = 1

    // Defina a quantidade de itens por página
    const itemsPerPage = 100

    // Calcule o índice inicial com base no número da página
    const startIndex = (page - 1) * itemsPerPage

    const mdev = await Mdev.findOrFail(id)

    if (realtime === 'true' || realtime === true) {
      await mdev.load('logs', (logQuery) => {
        logQuery
          .whereNull('leaved_at')
          .preload('device')
          .orderBy('id', 'desc')
          .offset(startIndex)
          .limit(itemsPerPage)
      })
    } else {
      await mdev.load('logs', (loader) => {
        loader.preload('device').orderBy('id', 'desc').offset(startIndex).limit(itemsPerPage)
      })
    }

    return response.ok(mdev)
  }

  // Método para gerar um relatório
  public async generateReport({ request, response }: HttpContext) {
    const id = request.param('id')

    try {
      // Aplicar a consulta SQL apenas para o mdev com mdev_id == id
      const data = await Database.rawQuery(
        `
        SELECT
          DATE_FORMAT(entered_at, '%Y-%m-%d %H:00:00') as hour_interval,
          COUNT(DISTINCT device_id) as unique_devices_count
        FROM
          logs
        WHERE
          mdev_id = ?
          AND entered_at IS NOT NULL
        GROUP BY
          hour_interval
        ORDER BY
          hour_interval
      `,
        [id]
      )

      // Retornar os dados
      return response.ok(data[0])
    } catch (error) {
      return response.badRequest({ message: 'No data found' })
    }
  }
}

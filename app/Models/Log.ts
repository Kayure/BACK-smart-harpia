import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import Device from './Device'

export default class Log extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public deviceId: number

  @belongsTo(() => Device)
  public device: BelongsTo<typeof Device>

  @column.dateTime({ autoCreate: true })
  public enteredAt: DateTime

  @column.dateTime()
  public leavedAt: DateTime
}

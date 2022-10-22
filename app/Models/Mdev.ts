import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import Local from './Local'

export default class Mdev extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public latitude: string

  @column()
  public longitude: string

  @column()
  public active: boolean

  @column()
  public localId: number

  @belongsTo(() => Local)
  public local: BelongsTo<typeof Local>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}

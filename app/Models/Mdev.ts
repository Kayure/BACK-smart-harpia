import { BaseModel, belongsTo, BelongsTo, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import Device from './Device'
import Local from './Local'
import Log from './Log'

export default class Mdev extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public nickname: string

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

  @hasMany(() => Device)
  public devices: HasMany<typeof Device>

  @hasMany(() => Log)
  public logs: HasMany<typeof Log>
}

import { BaseModel, belongsTo, BelongsTo, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import Log from './Log'
import Mdev from './Mdev'

export default class Device extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public macAddress: string

  @column()
  public name: string

  @column()
  public mdevId: number

  @belongsTo(() => Mdev)
  public mdev: BelongsTo<typeof Mdev>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Log)
  public logs: HasMany<typeof Log>
}

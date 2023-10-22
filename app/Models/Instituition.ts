import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import Local from './Local'
import User from './User'

export default class Instituition extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public abbreviation: string

  @column()
  public active: boolean

  @column()
  public imagePath: string

  @hasMany(() => User)
  public users: HasMany<typeof User>

  @hasMany(() => Local)
  public locales: HasMany<typeof Local>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}

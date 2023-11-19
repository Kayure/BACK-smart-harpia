import Hash from '@ioc:Adonis/Core/Hash'
import {
  BaseModel,
  beforeSave,
  belongsTo,
  BelongsTo,
  column,
  hasMany,
  HasMany,
} from '@ioc:Adonis/Lucid/Orm'
import Institution from 'App/Models/Institution'
import { DateTime } from 'luxon'

import LinkToken from './LinkToken'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column()
  public active: boolean

  @column()
  public admin: boolean

  @column()
  public systemAdmin: boolean

  @column()
  public imagePath: string

  @column()
  public institutionId: number

  @belongsTo(() => Institution)
  public institution: BelongsTo<typeof Institution>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column({ serializeAs: null })
  public password: string

  @hasMany(() => LinkToken, {
    foreignKey: 'userId',
  })
  public tokens: HasMany<typeof LinkToken>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) user.password = await Hash.make(user.password)
  }
}

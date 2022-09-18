// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContext } from '@adonisjs/core/build/standalone'
import User from 'App/Models/User'
import CreateUserValidator from 'App/Validators/CreateUserValidator'

export default class UsersController {
  public async store({ request, response }: HttpContext) {
    const userPayLoad = await request.validate(CreateUserValidator)

    const user = await User.create(userPayLoad)
    return response.created({ user })
  }
}

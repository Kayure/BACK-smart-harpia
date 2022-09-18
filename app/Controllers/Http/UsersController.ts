// import type { HttpContext } from '@ioc:Adonis/Core/HttpContext'

import { HttpContext } from '@adonisjs/core/build/standalone'
import BadRequestException from 'App/Exceptions/BadRequestException'
import User from 'App/Models/User'
import CreateUserValidator from 'App/Validators/CreateUserValidator'

export default class UsersController {
  public async store({ request, response }: HttpContext) {
    const userPayLoad = await request.validate(CreateUserValidator)

    const userByEmail = await User.findBy('email', userPayLoad.email)

    if (userByEmail) throw new BadRequestException('email already in use', 409)

    const user = await User.create(userPayLoad)
    return response.created({ user })
  }
}

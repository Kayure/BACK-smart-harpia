// import type { HttpContext } from '@ioc:Adonis/Core/HttpContext'

import { HttpContext } from '@adonisjs/core/build/standalone'
import BadRequestException from 'App/Exceptions/BadRequestException'
import User from 'App/Models/User'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import UpdateUserValidator from 'App/Validators/UpdateUserValidator'

export default class UsersController {
  public async store({ request, response }: HttpContext) {
    const userPayLoad = await request.validate(CreateUserValidator)

    const userByEmail = await User.findBy('email', userPayLoad.email)

    if (userByEmail) throw new BadRequestException('email already in use', 409)

    const user = await User.create(userPayLoad)
    return response.created({ user })
  }

  public async update({ request, response }: HttpContext) {
    const { email, name } = await request.validate(UpdateUserValidator)
    const id = request.param('id')
    const user = await User.findOrFail(id)

    const userByEmail = await User.findBy('email', email)

    if (userByEmail) throw new BadRequestException('email already in use', 409)

    user.email = email
    user.name = name
    await user.save()

    return response.ok({ user })
  }
}

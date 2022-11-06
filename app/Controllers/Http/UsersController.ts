// import type { HttpContext } from '@ioc:Adonis/Core/HttpContext'

import { HttpContext } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import Instituition from 'App/Models/Instituition'
import Occupation from 'App/Models/Occupation'
import User from 'App/Models/User'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import UpdateUserValidator from 'App/Validators/UpdateUserValidator'

export default class UsersController {
  public async store({ request, response }: HttpContext) {
    const userPayLoad = await request.validate(CreateUserValidator)

    const userByEmail = await User.findBy('email', userPayLoad.email)

    if (userByEmail) throw new BadRequestException('email already in use', 409)

    const user = await User.create(userPayLoad)

    const instituition = await Instituition.findOrFail(userPayLoad.instituition)
    await user.related('instituition').associate(instituition)

    const occupation = await Occupation.findOrFail(userPayLoad.occupation)
    await user.related('occupation').associate(occupation)

    return response.created({ user })
  }

  public async update({ request, response, bouncer }: HttpContextContract) {
    const { email, name } = await request.validate(UpdateUserValidator)
    const id = request.param('id')
    const user = await User.findOrFail(id)

    await bouncer.authorize('updateUser', user)

    const userByEmail = await User.findBy('email', email)

    if (userByEmail && userByEmail.id !== user.id)
      throw new BadRequestException('email already in use', 409)

    user.email = email
    user.name = name
    await user.save()

    return response.ok({ user })
  }

  public async desactivate({ request, response, bouncer }: HttpContextContract) {
    const id = request.param('id')
    const user = await User.findOrFail(id)

    await bouncer.authorize('updateUser', user)

    user.active = false
    await user.save()

    return response.noContent()
  }
}

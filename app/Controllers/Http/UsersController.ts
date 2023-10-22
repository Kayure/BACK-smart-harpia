import { HttpContext } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import Instituition from 'App/Models/Instituition'
import User from 'App/Models/User'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import UpdateUserValidator from 'App/Validators/UpdateUserValidator'

export default class UsersController {
  // Método para criar um novo usuário
  public async store({ request, response }: HttpContext) {
    const userPayLoad = await request.validate(CreateUserValidator)

    // Verificando se o e-mail já está em uso
    const userByEmail = await User.findBy('email', userPayLoad.email)

    if (userByEmail) throw new BadRequestException('email already in use', 409)

    const user = await User.create(userPayLoad)

    // Associando a instituição ao usuário
    const instituition = await Instituition.findOrFail(userPayLoad.instituition)
    await user.related('instituition').associate(instituition)

    return response.created({ user })
  }

  // Método para atualizar os dados de um usuário
  public async update({ request, response, bouncer }: HttpContextContract) {
    const { email, name, imagePath } = await request.validate(UpdateUserValidator)
    const id = request.param('id')
    const user = await User.findOrFail(id)

    // Verificando permissões de autorização usando o bouncer
    await bouncer.authorize('updateUser', user)

    const userByEmail = await User.findBy('email', email)

    // Verificando se o novo e-mail já está em uso
    if (userByEmail && userByEmail.id !== user.id)
      throw new BadRequestException('email already in use', 409)

    if (imagePath !== undefined) user.imagePath = imagePath

    user.email = email
    user.name = name
    await user.save()

    return response.ok({ user })
  }

  // Método para desativar um usuário
  public async desactivate({ request, response, bouncer }: HttpContextContract) {
    const id = request.param('id')
    const user = await User.findOrFail(id)

    // Verificando permissões de autorização usando o bouncer
    await bouncer.authorize('updateUser', user)

    user.active = false
    await user.save()

    return response.noContent()
  }
}

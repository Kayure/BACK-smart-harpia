import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'

export default class SessionsController {
  public async store({ request, response, auth }: HttpContextContract) {
    const { email, password } = request.only(['email', 'password'])

    const token = await auth.use('api').attempt(email, password, {
      expiresIn: '2hours',
    })

    const user = auth.user!

    if (!user.active) throw new BadRequestException('account disabled', 403)

    return response.created({ user, token })
  }

  public async destroy({ response, auth }: HttpContextContract) {
    await auth.use('api').revoke()

    return response.ok({})
  }

  public async getSession({ response, auth }: HttpContextContract) {
    auth.use('api').authenticate()

    const user = auth.user!

    return response.ok({ user })
  }
}

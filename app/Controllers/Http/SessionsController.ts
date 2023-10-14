import Env from '@ioc:Adonis/Core/Env'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import User from 'App/Models/User'

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

  public async googleRedirect({ ally }: HttpContextContract) {
    return ally.use('google').redirect()
  }

  public async googleLogin({ ally, auth, response }: HttpContextContract) {
    const google = ally.use('google')

    if (google.accessDenied()) {
      return 'Acess was denied'
    }

    if (google.stateMisMatch()) {
      return 'Request expired. Retry again'
    }

    if (google.hasError()) {
      return google.getError()
    }

    const googleUser = await google.user()

    if (googleUser.email !== null) {
      const user = await User.firstOrCreate(
        {
          email: googleUser.email,
        },
        {
          name: googleUser.name,
          occupationId: 1,
          instituitionId: 1,
          password: googleUser.token.token,
        }
      )

      const token = await auth.use('api').login(user, { expiresIn: '2hours' })

      //response.header('Authorization', `Bearer ${token}`)

      response.plainCookie('ACCESS_AUTHORIZATION_CODE', token.token, {
        httpOnly: false,
        sameSite: 'none',
        secure: true,
      })

      return response.redirect(Env.get('CALLBACK_REDIRECT_URL'))
    }
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

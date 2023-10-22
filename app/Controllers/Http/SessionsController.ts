import Env from '@ioc:Adonis/Core/Env'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import User from 'App/Models/User'

export default class SessionsController {
  // Método para autenticar um usuário e retornar um token
  public async store({ request, response, auth }: HttpContextContract) {
    const { email, password } = request.only(['email', 'password'])

    const token = await auth.use('api').attempt(email, password, {
      expiresIn: '2hours',
    })

    const user = auth.user!

    if (!user.active) throw new BadRequestException('account disabled', 403)

    return response.created({ user, token })
  }

  // Método para redirecionar para a autenticação do Google
  public async googleRedirect({ ally }: HttpContextContract) {
    return ally.use('google').redirect()
  }

  // Método para lidar com o login do Google
  public async googleLogin({ ally, auth, response }: HttpContextContract) {
    const google = ally.use('google')

    if (google.accessDenied()) {
      return 'Access was denied'
    }

    if (google.stateMisMatch()) {
      return 'Request expired. Retry again'
    }

    if (google.hasError()) {
      return google.getError()
    }

    const googleUser = await google.user()

    if (googleUser.email !== null) {
      //Obtém um usuário existente com base no email do usuário do Google
      const user = await User.firstOrFail()

      const token = await auth.use('api').login(user, { expiresIn: '1minute' })

      // Redireciona para o URL de retorno com o token no parâmetro de consulta
      return response.redirect(Env.get('CALLBACK_REDIRECT_URL') + '?authorization=' + token.token)
    }
  }

  // Método para trocar um token por outro, usado para trocar o token do Google que foi exposto por um seguro
  public async exchangeToken({ response, auth }: HttpContextContract) {
    await auth.use('api').authenticate()
    const user = auth.use('api').user!

    if (!user.active) throw new BadRequestException('account disabled', 403)

    await auth.use('api').revoke()

    const token = await auth.use('api').login(user, { expiresIn: '59minutes' })

    return response.created({ user, token })
  }

  // Método para revogar um token JWT e encerrar a sessão
  public async destroy({ response, auth }: HttpContextContract) {
    await auth.use('api').revoke()

    return response.ok({})
  }

  // Método para obter os detalhes da sessão do usuário autenticado
  public async getSession({ response, auth }: HttpContextContract) {
    await auth.use('api').authenticate()
    const user = auth.use('api').user!

    if (!user.active) throw new BadRequestException('account disabled', 403)

    return response.ok({ user })
  }
}

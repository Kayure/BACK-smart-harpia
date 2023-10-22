import Mail from '@ioc:Adonis/Addons/Mail'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TokenExpiredException from 'App/Exceptions/TokenExpiredException'
import User from 'App/Models/User'
import ForgotPasswordValidator from 'App/Validators/ForgotPasswordValidator'
import ResetPasswordValidator from 'App/Validators/ResetPasswordValidator'
import { randomBytes } from 'crypto'
import { promisify } from 'util'

export default class PasswordsController {
  // Método para processar uma solicitação de redefinição de senha
  public async forgotPassword({ request, response }: HttpContextContract) {
    const { email, resetPasswordUrl } = await request.validate(ForgotPasswordValidator)

    // Encontra o usuário com base no e-mail fornecido
    const user = await User.findByOrFail('email', email)

    // Gera um token aleatório
    const random = await promisify(randomBytes)(24)
    const token = random.toString('hex')

    // Atualiza ou cria um novo registro de token para o usuário
    await user.related('tokens').updateOrCreate(
      {
        userId: user.id,
      },
      {
        token,
      }
    )

    // Cria a URL de redefinição de senha com o token gerado
    const resetPasswordUrlWithToken = `${resetPasswordUrl}?token=${token}`

    // Envia um e-mail de recuperação de senha para o usuário
    await Mail.send((message) => {
      message
        .from('no-reply@ifprinteligente.com.br')
        .to(email)
        .subject('Smart Harpia: Recuperação de Senha')
        .htmlView('email/forgotpassword', {
          productName: 'Smart Harpia',
          name: user.name,
          resetPasswordUrl: resetPasswordUrlWithToken,
        })
    })

    return response.noContent()
  }

  // Método para redefinir a senha do usuário
  public async resetPassword({ request, response }: HttpContextContract) {
    // Extrai o token e a nova senha da solicitação
    const { token, password } = await request.validate(ResetPasswordValidator)

    // Encontra o usuário com base no token
    const userByToken = await User.query()
      .whereHas('tokens', (query) => {
        query.where('token', token)
      })
      .preload('tokens')
      .firstOrFail()

    // Calcula a idade do token em horas
    const tokenAge = Math.abs(userByToken.tokens[0].createdAt.diffNow('hours').hours)

    // Se o token tiver mais de 2 horas, gera uma exceção
    if (tokenAge > 2) throw new TokenExpiredException()

    // Define a nova senha do usuário e a salva no banco de dados
    userByToken.password = password
    await userByToken.save()

    // Exclui o token usado
    await userByToken.tokens[0].delete()

    return response.noContent()
  }
}

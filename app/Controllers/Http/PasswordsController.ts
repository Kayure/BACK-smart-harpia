import Mail from '@ioc:Adonis/Addons/Mail'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import ForgotPasswordValidator from 'App/Validators/ForgotPasswordValidator'

// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PasswordsController {
  public async forgotPassword({ request, response }: HttpContextContract) {
    const { email, resetPasswordUrl } = await request.validate(ForgotPasswordValidator)
    const user = await User.findByOrFail('email', email)

    await Mail.send((message) => {
      message
        .from('no-reply@ifprinteligente.com.br')
        .to(email)
        .subject('Smart Harpia: Recuperação de Senha')
        .htmlView('email/forgotpassword', {
          productName: 'Smart Harpia',
          name: user.name,
          resetPasswordUrl: 'url',
        })
    })
    return response.noContent()
  }
}

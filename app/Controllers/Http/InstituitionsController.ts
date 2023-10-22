import { HttpContext } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Instituition from 'App/Models/Instituition'
import CreateInstituitionValidator from 'App/Validators/CreateInstituitionValidator'
import UpdateInstituitionValidator from 'App/Validators/UpdateInstituitionValidator'

export default class InstituitionsController {
  // Método para criar uma nova instituição
  public async store({ request, response }: HttpContext) {
    const instituitionPayLoad = await request.validate(CreateInstituitionValidator)

    const instituition = await Instituition.create(instituitionPayLoad)
    return response.created({ instituition })
  }

  // Método para atualizar uma instituição existente
  public async update({ request, response, bouncer }: HttpContextContract) {
    const { name, abbreviation, imagePath } = await request.validate(UpdateInstituitionValidator)
    const id = request.param('id')

    const instituition = await Instituition.findOrFail(id)

    // Autoriza a atualização da instituição somente se pertencer ao usuário e ele for administrador de tal
    await bouncer.authorize('updateInstituition', instituition)

    if (imagePath !== undefined) instituition.imagePath = imagePath

    instituition.name = name
    instituition.abbreviation = abbreviation

    instituition.save()

    return response.ok({ instituition })
  }

  // Método para excluir uma instituição
  public async destroy({ request, response }: HttpContext) {
    const id = request.param('id')

    const instituition = await Instituition.findOrFail(id)
    instituition.delete()

    return response.noContent()
  }

  // Método para obter todas as instituições
  public async read({ response }: HttpContext) {
    const instituitions = await Instituition.all()

    return response.ok({ instituitions })
  }
}

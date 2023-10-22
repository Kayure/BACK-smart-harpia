import { HttpContext } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Institution from 'App/Models/Institution'
import CreateInstitutionValidator from 'App/Validators/CreateInstitutionValidator'
import UpdateInstitutionValidator from 'App/Validators/UpdateInstitutionValidator'

export default class InstitutionsController {
  // Método para criar uma instituição
  public async store({ request, response }: HttpContext) {
    const institutionPayLoad = await request.validate(CreateInstitutionValidator)

    const institution = await Institution.create(institutionPayLoad)
    return response.created({ institution })
  }

  // Método para atualizar uma instituição existente
  public async update({ request, response, bouncer }: HttpContextContract) {
    const { name, abbreviation, imagePath } = await request.validate(UpdateInstitutionValidator)
    const id = request.param('id')

    const institution = await Institution.findOrFail(id)

    // Autoriza a atualização da instituição somente se pertencer ao usuário e ele for administrador de tal
    await bouncer.authorize('updateInstitution', institution)

    if (imagePath !== undefined) institution.imagePath = imagePath

    institution.name = name
    institution.abbreviation = abbreviation

    await institution.save()

    return response.ok({ institution })
  }

  // Método para excluir uma instituição
  public async destroy({ request, response }: HttpContext) {
    const id = request.param('id')

    const institution = await Institution.findOrFail(id)
    await institution.delete()

    return response.noContent()
  }

  // Método para obter todas as instituições
  public async read({ response }: HttpContext) {
    const institutions = await Institution.all()

    return response.ok({ institutions })
  }
}

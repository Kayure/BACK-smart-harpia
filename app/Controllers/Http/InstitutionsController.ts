import { HttpContext } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import Institution from 'App/Models/Institution'
import Local from 'App/Models/Local'
import User from 'App/Models/User'
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
    const { name, abbreviation, imagePath, active } = await request.validate(
      UpdateInstitutionValidator
    )
    const id = request.param('id')

    const institution = await Institution.findOrFail(id)

    // Autoriza a atualização da instituição somente se pertencer ao usuário e ele for administrador de tal
    await bouncer.authorize('updateInstitution', institution)

    if (imagePath) {
      institution.imagePath = imagePath
    } else {
      institution.imagePath = ''
    }

    if (abbreviation) {
      institution.abbreviation = abbreviation
    } else {
      institution.abbreviation = ''
    }
    if (active !== undefined) institution.active = active

    institution.name = name

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

  // Método para obter uma instituição por ID
  public async getInstitutionById({ request, response }: HttpContext) {
    const id = request.param('id')

    const institution = await Institution.findOrFail(id)

    return response.ok({ institution })
  }

  // Retorna todos usuários associados a instituição
  public async getInstitutionUsersById({ request, response }: HttpContext) {
    const id = request.param('id')

    const users = await User.query().where('institution_id', id)

    return response.ok({ users })
  }

  // Retorna todos locais associados a instituição
  public async getInstitutionLocalsById({ request, response }: HttpContext) {
    const id = request.param('id')

    const locals = await Local.query().where('institution_id', id)

    return response.ok({ locals })
  }

  // Retorna o usuário e as instituições que ele possui permissão (Criada específicamente para caso de uso no Front-end)
  public async readAllowedInstitutions({ response, auth }: HttpContextContract) {
    await auth.use('api').authenticate()
    const user = auth.use('api').user!

    if (!user.active) throw new BadRequestException('account disabled', 403)

    if (user.systemAdmin) {
      const institutions = await Institution.all()
      return response.ok({ user, institutions })
    }

    const institutions = await Institution.findOrFail(user.institutionId)

    return response.ok({ user, institutions: [institutions] })
  }
}

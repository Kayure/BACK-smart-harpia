import { HttpContext } from '@adonisjs/core/build/standalone'
import Institution from 'App/Models/Institution'
import Local from 'App/Models/Local'
import CreateLocalValidator from 'App/Validators/CreateLocalValidator'
import UpdateLocalValidator from 'App/Validators/UpdateLocalValidator'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Mdev from 'App/Models/Mdev'

export default class LocalsController {
  // Método para criar um local
  public async store({ request, response }: HttpContext) {
    const localPayLoad = await request.validate(CreateLocalValidator)

    // Cria um local no banco de dados
    const local = await Local.create(localPayLoad)

    // Encontra e associa uma instituição ao local
    const institution = await Institution.findOrFail(localPayLoad.institution)
    await local.related('institution').associate(institution)

    return response.created({ local })
  }

  // Método para atualizar um local existente
  public async update({ request, response, bouncer }: HttpContextContract) {
    const { name, institution, ibgeCode } = await request.validate(UpdateLocalValidator)
    const id = request.param('id')
    const local = await Local.findOrFail(id)

    // Autoriza a atualização do local somente se pertencer à instituição do usuário
    await bouncer.authorize('updateLocal', local)

    // Encontra e associa uma nova instituição ao local
    if (institution) {
      const newInstitution = await Institution.findOrFail(institution)
      await local.related('institution').associate(newInstitution)
    }

    local.name = name

    local.ibgeCode = ibgeCode

    // Salva as alterações no banco de dados
    await local.save()

    return response.ok({ local })
  }

  // Método para excluir um local
  public async destroy({ request, response }: HttpContext) {
    const id = request.param('id')

    // Encontra o local e o exclui do banco de dados
    const local = await Local.findOrFail(id)
    await local.delete()

    return response.noContent()
  }

  // Método para obter todos os locais
  public async read({ response }: HttpContext) {
    const locals = await Local.all()

    return response.ok({ locals })
  }

  // Método para obter local pelo ID
  public async getLocalById({ request, response }: HttpContext) {
    const id = request.param('id')

    // Encontra o local
    const local = await Local.findOrFail(id)

    return response.ok({ local })
  }

  // Retorna todos mdevs associados a local
  public async getLocalMdevsById({ request, response }: HttpContext) {
    const id = request.param('id')

    const mdevs = await Mdev.query().where('local_id', id)

    return response.ok({ mdevs })
  }
}

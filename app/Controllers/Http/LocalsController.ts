import { HttpContext } from '@adonisjs/core/build/standalone'
import City from 'App/Models/City'
import Instituition from 'App/Models/Instituition'
import Local from 'App/Models/Local'
import CreateLocalValidator from 'App/Validators/CreateLocalValidator'
import UpdateLocalValidator from 'App/Validators/UpdateLocalValidator'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LocalsController {
  // Método para criar um novo local
  public async store({ request, response }: HttpContext) {
    const localPayLoad = await request.validate(CreateLocalValidator)

    // Cria um novo local no banco de dados
    const local = await Local.create(localPayLoad)

    // Encontra e associa uma instituição ao local
    const instituition = await Instituition.findOrFail(localPayLoad.instituition)
    await local.related('instituition').associate(instituition)

    // Encontra e associa uma cidade ao local
    const city = await City.findOrFail(localPayLoad.city)
    await local.related('city').associate(city)

    return response.created({ local })
  }

  // Método para atualizar um local existente
  public async update({ request, response, bouncer }: HttpContextContract) {
    const { name, city, instituition } = await request.validate(UpdateLocalValidator)
    const id = request.param('id')
    const local = await Local.findOrFail(id)

    // Autoriza a atualização do local somente se pertencer a instituição do usuário
    await bouncer.authorize('updateLocal', local)

    // Encontra e associa uma nova cidade ao local
    const newCity = await City.findOrFail(city)
    await local.related('city').associate(newCity)

    // Encontra e associa uma nova instituição ao local
    const newInstituition = await Instituition.findOrFail(instituition)
    await local.related('instituition').associate(newInstituition)

    local.name = name

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
}

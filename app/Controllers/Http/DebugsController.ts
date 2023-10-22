import { HttpContext } from '@adonisjs/core/build/standalone'
import Debug from 'App/Models/Debug'
import Mdev from 'App/Models/Mdev'
import CreateDebugValidator from 'App/Validators/CreateDebugValidator'

export default class DebugsController {
  // Método para armazenar um registro de debug
  public async store({ request, response }: HttpContext) {
    const debugPayLoad = await request.validate(CreateDebugValidator)

    const debug = await Debug.create(debugPayLoad)

    const mdev = await Mdev.findOrFail(debugPayLoad.mdevId)

    await debug.related('mdev').associate(mdev)

    return response.created({ debug })
  }
}

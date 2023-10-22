import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Instituition from 'App/Models/Instituition'

export default class extends BaseSeeder {
  public async run() {
    await Instituition.create({
      id: 1,
      name: 'Smart Harpia',
    })
  }
}

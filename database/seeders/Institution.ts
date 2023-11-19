import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Institution from 'App/Models/Institution'

export default class extends BaseSeeder {
  public async run() {
    await Institution.create({
      id: 1,
      name: 'Smart Harpia',
      imagePath: 'https://i.pinimg.com/originals/e4/b3/6d/e4b36d19932ba8ba22447fe9c84fc59a.jpg',
    })
  }
}

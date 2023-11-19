import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run() {
    await User.create({
      id: 1,
      name: 'Angelo Andrioli Netho',
      email: 'angelonetho@gmail.com',
      imagePath:
        'https://gifdb.com/images/high/peter-griffin-family-guy-coming-at-you-hnw5f3wjemsglmyn.webp',
      password: '1234',
      admin: true,
      systemAdmin: true,
      institutionId: 1,
    })
  }
}

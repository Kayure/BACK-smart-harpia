import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run() {
    await User.create({
      id: 1,
      name: 'Angelo',
      email: 'angelo@netho.dev',
      password: '1234',
      admin: true,
      systemAdmin: true,
      institutionId: 1,
    })
  }
}

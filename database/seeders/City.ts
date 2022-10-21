import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import City from 'App/Models/City'

export default class extends BaseSeeder {
  public async run() {
    await City.createMany([
      {
        name: 'Paranaguá',
        stateId: 16,
      },
      {
        name: 'Curitiba',
        stateId: 16,
      },
      {
        name: 'Foz de Iguaçu',
        stateId: 16,
      },
      {
        name: 'Porto Alegre',
        stateId: 21,
      },
      {
        name: 'São Paulo',
        stateId: 25,
      },
      {
        name: 'Rio de Janeiro',
        stateId: 19,
      },
    ])
  }
}

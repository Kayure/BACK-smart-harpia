import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

export default class IndexSeeder extends BaseSeeder {
  public async run() {
    await this.runSeeder(await import('../Institution'))
    await this.runSeeder(await import('../User'))
  }

  private async runSeeder(Seeder: { default: typeof BaseSeeder }) {
    await new Seeder.default(this.client).run()
  }
}

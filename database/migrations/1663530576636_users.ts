import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('email').notNullable().unique()
      table.string('name').notNullable()
      table.integer('instituition_id').unsigned().references('instituitions.id').onDelete('CASCADE')
      table.integer('occupation_id').unsigned().references('occupations.id').onDelete('CASCADE')
      table.string('password').notNullable()
      table.boolean('active').defaultTo(true)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

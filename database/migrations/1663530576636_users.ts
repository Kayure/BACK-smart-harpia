import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('email').notNullable().unique()
      table.string('name').notNullable()
      table.string('password').notNullable()
      table.integer('institution_id').unsigned().references('institutions.id').onDelete('CASCADE')
      table.boolean('active').defaultTo(true)
      table.boolean('admin').defaultTo(false)
      table.boolean('system_admin').defaultTo(false)
      table.string('image_path', 255).nullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

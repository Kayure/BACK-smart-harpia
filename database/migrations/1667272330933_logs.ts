import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'logs'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('device_id').unsigned().references('devices.id').onDelete('CASCADE')
      table.integer('mdev_id').unsigned().references('mdevs.id').onDelete('CASCADE')
      table.boolean('reseted').defaultTo(false)
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('entered_at', { useTz: true })
      table.timestamp('leaved_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

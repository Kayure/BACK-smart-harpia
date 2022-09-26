import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

test.group('Instituition Creation', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should create an instituition', async ({ client, assert }) => {
    const userPayLoad = {
      name: 'Instituition test name',
      abbreviation: 'ITN',
    }

    const response = await client.post('/users').form(userPayLoad)
    const body = response.body()

    response.assertStatus(201)
    assert.exists(body.instituition, 'Instituition undefined')
    assert.exists(body.instituition.id, 'Id undefined')
    assert.equal(body.instituition.name, userPayLoad.name)
    assert.equal(body.instituition.abbreviation, userPayLoad.abbreviation)
  })
})

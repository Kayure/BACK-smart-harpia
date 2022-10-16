import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

test.group('User Creation', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should create an occupation', async ({ client, assert }) => {
    const userPayLoad = {
      name: 'Nome Teste',
      description: 'Descrição teste',
    }

    const response = await client.post('/occupations').form(userPayLoad)
    const body = response.body()

    response.assertStatus(201)
    assert.exists(body.occupation, 'Occupation undefined')
    assert.exists(body.occupation.id, 'Id undefined')
    assert.equal(body.occupation.description, userPayLoad.description)
    assert.equal(body.occupation.name, userPayLoad.name)
  })
})

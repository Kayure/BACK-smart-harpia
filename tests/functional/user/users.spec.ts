import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

test.group('Users', (group) => {
  test('it should create an user', async ({ client, assert }) => {
    const userPayLoad = {
      email: 'test@test.com',
      name: 'Nome Teste',
      password: 'teste',
    }

    const response = await client.post('/users').form(userPayLoad)
    const body = response.body()
    console.log(body)

    assert.exists(body.user, 'User undefined')
    assert.exists(body.user.id, 'Id undefined')
    assert.equal(body.user.email, userPayLoad.email)
    assert.equal(body.user.name, userPayLoad.name)
    assert.notExists(body.user.password, 'Password defined')
  })

  group.setup(async () => {
    await Database.beginGlobalTransaction()
  })

  group.teardown(async () => {
    await Database.rollbackGlobalTransaction()
  })
})

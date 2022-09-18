import { UserFactory } from 'Database/factories'
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

    assert.exists(body.user, 'User undefined')
    assert.exists(body.user.id, 'Id undefined')
    assert.equal(body.user.email, userPayLoad.email)
    assert.equal(body.user.name, userPayLoad.name)
    assert.notExists(body.user.password, 'Password defined')
  })

  test('it should return 409 when email is already in use', async ({ client, assert }) => {
    const { email } = await UserFactory.create()
    const response = await client.post('/users').form({
      email,
      name: 'test',
      password: 'test',
    })
    const body = response.body()

    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)
    assert.include(body.message, 'email')
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 409)
  })

  test('it should return 422 when required data is not provided', async ({ client, assert }) => {
    const response = await client.post('/users').form({})
    const body = response.body()
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  group.setup(async () => {
    await Database.beginGlobalTransaction()
  })

  group.teardown(async () => {
    await Database.rollbackGlobalTransaction()
  })
})

import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'

test.group('User Creation', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should create an user', async ({ client, assert }) => {
    const userPayLoad = {
      email: 'test@test.com',
      name: 'Nome Teste',
      password: 'teste',
    }

    const response = await client.post('/users').form(userPayLoad)
    const body = response.body()

    response.assertStatus(201)
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

  test('it should return 422 when providin an invalid email', async ({ client, assert }) => {
    const response = await client.post('/users').form({
      email: 'test@',
      name: 'test',
      password: 'test',
    })
    const body = response.body()
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('it should return 422 when providin an invalid password', async ({ client, assert }) => {
    const response = await client.post('/users').form({
      email: 'test@test.com',
      name: 'test',
      password: '123',
    })
    const body = response.body()
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('it should update an user', async ({ client, assert }) => {
    const { id } = await UserFactory.create()
    const email = 'test@test.com'
    const name = 'Test Update'

    const response = await client.put(`/users/${id}`).form({
      email,
      name,
    })
    const body = response.body()

    response.assertStatus(200)
    assert.exists(body.user, 'User undefined')
    assert.equal(body.user.email, email)
    assert.equal(body.user.name, name)
    assert.equal(body.user.id, id)
  })

  test('it should return 422 when providing an invalid email', async ({ client, assert }) => {
    const { id, name } = await UserFactory.create()
    const response = await client.put(`/users/${id}`).form({
      email: 'test@',
      name,
    })
    const body = response.body()

    response.assertStatus(422)
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('it should return 422 when providing an invalid name', async ({ client, assert }) => {
    const { id, email } = await UserFactory.create()
    const response = await client.put(`/users/${id}`).form({
      email,
      name: 'a',
    })
    const body = response.body()

    response.assertStatus(422)
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })
})

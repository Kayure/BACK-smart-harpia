import Mail from '@ioc:Adonis/Addons/Mail'
import Hash from '@ioc:Adonis/Core/Hash'
import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { DateTime, Duration } from 'luxon'

import { UserFactory } from "Database/factories"

test.group('Forgot Password', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should send an email with forgot password instructions', async ({ client, assert }) => {
    const user = await UserFactory.create()

    const mailer = Mail.fake()

    const response = await client.post('/forgot-password').form({
      email: user.email,
      resetPasswordUrl: 'url',
    })

    const message = mailer.find((mail) => {
      return mail.to![0].address === user.email
    })

    response.assertStatus(204)
    assert.deepEqual(message?.to![0].address, user.email)
    assert.deepEqual(message?.from?.address, 'no-reply@ifprinteligente.com.br')
    assert.equal(message?.subject, 'Smart Harpia: Recuperação de Senha')
    assert.include(message?.html!, user.name)

    Mail.restore()
  }).timeout(0)

  test('it should create a reset password token', async ({ client, assert }) => {
    const user = await UserFactory.create()

    Mail.fake()

    const response = await client.post('/forgot-password').form({
      email: user.email,
      resetPasswordUrl: 'url',
    })

    const tokens = await user.related('tokens').query()
    assert.isNotEmpty(tokens)
    response.assertStatus(204)

    Mail.restore()
  }).timeout(0)

  test('it should return 422 when required data is not provided', async ({ client, assert }) => {
    const response = await client.post('/forgot-password').form({})
    const body = response.body()
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })
})

test.group('Reset Password', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should be able to reset password', async ({ client, assert }) => {
    const user = await UserFactory.create()
    const { token } = await user.related('tokens').create({ token: 'token' })

    const response = await client.post('/reset-password').form({
      token,
      password: '123456',
    })

    await user.refresh()
    await Hash

    response.assertStatus(204)
    const checkPassword = await Hash.verify(user.password, '123456')
    assert.isTrue(checkPassword)
  })

  test('it should return 404 when using the same token twice', async ({ client, assert }) => {
    const user = await UserFactory.create()
    const { token } = await user.related('tokens').create({ token: 'token' })

    await client.post('/reset-password').form({
      token,
      password: '123456',
    })

    const response = await client.post('/reset-password').form({
      token,
      password: '123456',
    })
    const body = response.body()

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 404)
  })

  test('it cannot reset password when token is expired after 2 hours', async ({
    client,
    assert,
  }) => {
    const user = await UserFactory.create()
    const date = DateTime.now().minus(Duration.fromISOTime('02:01'))
    const { token } = await user.related('tokens').create({ token: 'token', createdAt: date })

    const response = await client.post('/reset-password').form({
      token,
      password: '123456',
    })
    const body = response.body()

    response.assertStatus(410)
    assert.equal(body.code, 'TOKEN_EXPIRED')
    assert.equal(body.status, 410)
    assert.equal(body.message, 'token has expired')
  })

  test('it should return 422 when required data is not provided', async ({ client, assert }) => {
    const response = await client.post('/reset-password').form({})
    const body = response.body()
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })
})

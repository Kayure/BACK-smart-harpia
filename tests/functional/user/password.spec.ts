import Mail from '@ioc:Adonis/Addons/Mail'
import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

import { UserFactory } from './../../../database/factories/index'

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

    const response = await client.post('/forgot-password').form({
      email: user.email,
      resetPasswordUrl: 'url',
    })

    const tokens = await user.related('tokens').query()
    assert.isNotEmpty(tokens)
    response.assertStatus(204)
  }).timeout(0)

  test('it should return 422 when required data is not provided', async ({ client, assert }) => {
    const response = await client.post('/users').form({})
    const body = response.body()
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })
})

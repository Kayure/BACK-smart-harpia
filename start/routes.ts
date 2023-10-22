/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('', 'InstitutionsController.read')
  Route.post('', 'InstitutionsController.store')
  Route.put('/:id', 'InstitutionsController.update')
  Route.delete('/:id', 'InstitutionsController.destroy')
})
  .prefix('/institutions')
  .middleware('auth')

Route.group(() => {
  Route.post('', 'UsersController.store')
  Route.put('/:id', 'UsersController.update').middleware('auth')
  Route.delete('/:id', 'UsersController.deactivate').middleware('auth')
})
  .prefix('/users')
  .middleware('auth')

Route.post('/forgot-password', 'PasswordsController.forgotPassword')
Route.post('/reset-password', 'PasswordsController.resetPassword')

Route.post('/sessions', 'SessionsController.store')
Route.get('/sessions', 'SessionsController.getSession').middleware('auth')
Route.delete('/sessions', 'SessionsController.destroy')

Route.group(() => {
  Route.get('', 'LocalsController.read')
  Route.post('', 'LocalsController.store')
  Route.put('/:id', 'LocalsController.update')
  Route.delete('/:id', 'LocalsController.destroy')
})
  .prefix('/locals')
  .middleware('auth')

Route.group(() => {
  Route.get('', 'MdevsController.read')
  Route.get('/:id', 'MdevsController.getMdevByID')
  Route.post('', 'MdevsController.store')
  Route.put('/:id', 'MdevsController.update')
  Route.delete('/:id', 'MdevsController.destroy')
})
  .prefix('/mdevs')
  .middleware('auth')

Route.post('/mdevs/:id', 'MdevsController.reset')

Route.group(() => {
  Route.get('', 'DevicesController.read')
  Route.get('/:id', 'DevicesController.getDeviceByID')
  Route.post('', 'DevicesController.store')
  Route.put('/:id', 'DevicesController.update')
  Route.delete('/:id', 'DevicesController.destroy')
})
  .prefix('/devices')
  .middleware('auth')

Route.group(() => {
  Route.get('/local/:id', 'LogsController.listByLocal')
  Route.get('/mdev/:id', 'LogsController.listByMdev')
  Route.get('/report', 'LogsController.generateReport')
  Route.post('/in', 'LogsController.store')
  Route.put('/out', 'LogsController.update')
}).prefix('/logs')

Route.post('/debug', 'DebugsController.store')

Route.get('/google/redirect', 'SessionsController.googleRedirect')

Route.get('/google/callback', 'SessionsController.googleLogin')
Route.post('/sessions/google', 'SessionsController.exchangeToken')

Route.patch('/devices/:macAddress', 'DevicesController.deleteMacByMac')

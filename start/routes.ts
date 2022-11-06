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

Route.post('/instituitions', 'InstituitionsController.store')

Route.post('/occupations', 'OccupationsController.store')

Route.group(() => {
  Route.post('', 'UsersController.store')
  Route.put('/:id', 'UsersController.update').middleware('auth')
}).prefix('/users')

Route.post('/forgot-password', 'PasswordsController.forgotPassword')
Route.post('/reset-password', 'PasswordsController.resetPassword')

Route.post('/sessions', 'SessionsController.store')
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
  Route.post('', 'MdevsController.store')
  Route.put('/:id', 'MdevsController.update')
  Route.delete('/:id', 'MdevsController.destroy')
  Route.post('/:id', 'MdevsController.reset')
})
  .prefix('/mdevs')
  .middleware('auth')

Route.group(() => {
  Route.get('', 'DevicesController.read')
  Route.post('', 'DevicesController.store')
  Route.put('/:id', 'DevicesController.update')
  Route.delete('/:id', 'DevicesController.destroy')
})
  .prefix('/devices')
  .middleware('auth')

Route.group(() => {
  Route.post('/in', 'LogsController.store')
  Route.put('/out', 'LogsController.update')
}).prefix('/logs')

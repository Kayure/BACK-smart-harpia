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
  Route.get('', 'InstituitionsController.read')
  Route.post('', 'InstituitionsController.store')
  Route.put('/:id', 'InstituitionsController.update')
  Route.delete('/:id', 'InstituitionsController.destroy')
}).prefix('/instituitions')

Route.group(() => {
  Route.get('', 'OccupationsController.read')
  Route.post('', 'OccupationsController.store')
  Route.put('/:id', 'OccupationsController.update')
  Route.delete('/:id', 'OccupationsController.destroy')
}).prefix('/occupations')

Route.group(() => {
  Route.post('', 'UsersController.store')
  Route.put('/:id', 'UsersController.update').middleware('auth')
  Route.delete('/:id', 'UsersController.desactivate').middleware('auth')
}).prefix('/users')

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
  Route.post('', 'DevicesController.store')
  Route.put('/:id', 'DevicesController.update')
  Route.delete('/:id', 'DevicesController.destroy')
})
  .prefix('/devices')
  .middleware('auth')

Route.group(() => {
  Route.get('/local/:id', 'LogsController.listByLocal')
  Route.get('/mdev/:id', 'LogsController.listByMdev')
  Route.post('/in', 'LogsController.store')
  Route.put('/out', 'LogsController.update')
}).prefix('/logs')

Route.post('/debug', 'DebugsController.store')

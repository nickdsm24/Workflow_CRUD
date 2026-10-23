import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';

const routes = Router();

routes.get('/', userController.findAllUsers);
routes.get('/:cpf', userController.findUserByCpf);
routes.post('/', userController.createUser);
routes.put('/:cpf', userController.updateUser);
routes.patch('/:cpf', userController.updateUser);
routes.delete('/:cpf', userController.deleteUser);

export const userRoutes = routes;

import { Router } from 'express';
import * as todoController from '../controllers/todo.controller';
import { validateTodo } from '../middlewares/todo.middleware';

const router = Router();

router.get('/', todoController.getTodos);
router.post('/', validateTodo, todoController.createTodo);
router.put('/:id', validateTodo, todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);

export default router;

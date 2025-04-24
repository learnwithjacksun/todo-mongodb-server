import express from 'express';
import { createTodo} from '../controllers/todo.controller.js';

const todoRouter = express.Router();

// Define the routes for the todo API
todoRouter.post('/create', createTodo);

export default todoRouter;

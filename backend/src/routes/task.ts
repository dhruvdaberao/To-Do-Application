import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { validateTask } from '../validators/taskValidator';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Protect all task routes
router.use(authMiddleware);

router.post('/', validateTask, TaskController.createTask);
router.get('/', TaskController.getTasks);
router.get('/:id', TaskController.getTaskById);
router.put('/:id', validateTask, TaskController.updateTask);
router.patch('/:id/toggle', TaskController.toggleTask);
router.delete('/:id', TaskController.deleteTask);

export default router;

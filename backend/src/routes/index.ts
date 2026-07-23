import { Router } from 'express';
import healthRoutes from './health';
import authRoutes from './auth';
import taskRoutes from './task';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);

export default router;

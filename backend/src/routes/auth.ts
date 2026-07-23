import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validateRegister, validateLogin } from '../validators/authValidator';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', validateRegister, AuthController.register);
router.post('/login', validateLogin, AuthController.login);
router.get('/me', authMiddleware, AuthController.getMe);

export default router;

import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const user = await AuthService.register(email, password);
      res.status(201).json({ success: true, user });
    } catch (error: any) {
      if (error.status) {
        res.status(error.status).json({ success: false, message: error.message });
      } else {
        next(error);
      }
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const { token, user } = await AuthService.login(email, password);
      res.status(200).json({ success: true, token, user });
    } catch (error: any) {
      if (error.status) {
        res.status(error.status).json({ success: false, message: error.message });
      } else {
        next(error);
      }
    }
  }

  static async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // req.user is populated by authMiddleware
      if (!req.user) {
         res.status(401).json({ success: false, message: 'Not authenticated' });
         return;
      }
      res.status(200).json({ success: true, user: req.user });
    } catch (error) {
      next(error);
    }
  }
}

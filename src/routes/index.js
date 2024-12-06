import { Router } from 'express';
import { authRoutes } from './auth.routes.js';
import { userRoutes } from './user.routes.js';
import { clientRoutes } from './client.routes.js';
import { developmentRoutes } from './development.routes.js';
import { receivableRoutes } from './receivable.routes.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', authMiddleware, userRoutes);
router.use('/clients', authMiddleware, clientRoutes);
router.use('/developments', authMiddleware, developmentRoutes);
router.use('/receivables', authMiddleware, receivableRoutes);

export { router };
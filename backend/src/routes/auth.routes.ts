/**
 * routes/auth.routes.ts
 *
 * Express Router for all Auth endpoints.
 *
 * Routes:
 *   POST /api/auth/register → register  (body: registerSchema)
 *   POST /api/auth/login    → login     (body: loginSchema)
 *   POST /api/auth/logout   → logout
 *   GET  /api/auth/me       → getMe     (requires authentication)
 */

import { Router } from 'express';
import { validate } from '../middleware/validate.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { registerSchema, loginSchema } from '../validators/auth.validator';
import * as authController from '../controllers/auth.controller';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login',    validate(loginSchema),    authController.login);
router.post('/logout',   authController.logout);
router.get('/me',        authenticate,             authController.getMe);

export default router;

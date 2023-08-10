import { FastifyInstance } from 'fastify';

import { verifyJwt } from '@/http/middlewares/verify-jwt';

import { register } from './register-controller';
import { authenticate } from './authenticate-controller';
import { profile } from './profile-controller';

export async function usersRoutes(app: FastifyInstance) {
	app.post('/users', register);

	app.post('/sessions', authenticate);

	/** Authenticated */
	app.get('/me', { onRequest: [verifyJwt] }, profile);
}

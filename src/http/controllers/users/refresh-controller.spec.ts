import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { app } from '@/app';

describe('Refresh Token (e2e)', () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it('should be able to refresh a token', async () => {
		await request(app.server)
			.post('/users')
			.send({
				name: 'Jhon Doe',
				email: 'jhondoe@example.com',
				password: '123456'
			});

		const autheResponse = await request(app.server)
			.post('/sessions')
			.send({
				email: 'jhondoe@example.com',
				password: '123456'
			});

		const cookie = autheResponse.get('Set-Cookie');

		const response = await request(app.server)
			.patch('/token/refresh')
			.set('Cookie', cookie)
			.send();

		expect(response.statusCode).toEqual(200);
		expect(response.body).toEqual({
			token: expect.any(String)
		});
		expect(response.get('Set-Cookie')).toEqual([
			expect.stringContaining('refreshToken=')
		]);
	});
});

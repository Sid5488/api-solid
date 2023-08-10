import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

import { makeNearbyGymsUseCase } from 
	'@/use-cases/factories/make-nearby-gyms-use-case';

export async function search(request: FastifyRequest, reply: FastifyReply) {
	const nearbyGymsQUerySchema = z.object({
		latitude: z.number().refine(value => {
			return Math.abs(value) <= 90;
		}),
		longitude: z.number().refine(value => {
			return Math.abs(value) <= 180;
		}),
	});

	const { latitude, longitude } = nearbyGymsQUerySchema.parse(request.query);

	const fetchNearbyUseCase = makeNearbyGymsUseCase();

	const { gyms } = await fetchNearbyUseCase.execute({
		userLatitude: latitude,
		userLongitude: longitude
	});

	return reply.status(200).send({ gyms });
}

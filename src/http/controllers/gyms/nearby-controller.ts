import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

import { makeSearchGymsUseCase } from 
	'@/use-cases/factories/make-search-gyms-use-case';

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
	const searchGymsQuerySchema = z.object({
		q: z.string(),
		page: z.coerce.number().min(1).default(1),
	});

	const { q, page } = searchGymsQuerySchema.parse(request.query);

	const searchUseCase = makeSearchGymsUseCase();

	const { gyms } = await searchUseCase.execute({ query: q, page });

	return reply.status(200).send({ gyms });
}

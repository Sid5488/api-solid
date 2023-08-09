import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

import { PrismaUsersRepository } from 
	'@/repositories/prisma/prisma-users-repository';
import { InvalidCredentialsError } from 
	'@/use-cases/errors/invalid-credentials-error';

import { AuthenticateUseCase } from '@/use-cases/authenticate';

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
	const authenticateBodySchema = z.object({
		email: z.string().email(),
		password: z.string().min(6),
	});

	const { email, password } = authenticateBodySchema.parse(request.body);

	try {
		const prismaUsersRepository = new PrismaUsersRepository();
		const authenticateUseCase = new AuthenticateUseCase(prismaUsersRepository);

		const { user } = await authenticateUseCase.execute({ email, password });

		const token = await reply.jwtSign({}, {
			sign: {
				sub: user.id
			}
		});

		return reply.status(200).send(token);
	} catch(error) {
		if (error instanceof InvalidCredentialsError) {
			return reply.status(400).send({ message: error.message });
		}
    
		throw error;
	}
}

import { hash } from 'bcryptjs';

import { IUsersRepository } from '@/repositories/users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { User } from '@prisma/client';

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string
}

interface IRegisterUseCaseResponse {
  user: User;
}

export class RegisterUseCase {
	constructor(private readonly usersRepository: IUsersRepository) {}

	async execute({
		name,
		email,
		password
	}: RegisterUseCaseRequest): Promise<IRegisterUseCaseResponse> {
		const passwordHash = await hash(password, 6);
  
		const userWithSameEmail = await this.usersRepository.findByEmail(email);
  
		if (userWithSameEmail) {
			throw new UserAlreadyExistsError();
		}
    
		const user = await this.usersRepository.create({
			name,
			email,
			password_hash: passwordHash,
		});

		return { user };
	}
}

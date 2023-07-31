import { User } from '@prisma/client';

import { IUsersRepository } from '@/repositories/users-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface IGetUserProfileUSeCaseRequest {
  userId: string;
}

interface IGetUserProfileUseCaseResponse {
  user: User;
}

export class GetUserProfileUseCase {
	constructor(private readonly usersRepository: IUsersRepository) {}

	async execute({ 
		userId 
	}: IGetUserProfileUSeCaseRequest): Promise<IGetUserProfileUseCaseResponse> {
		const user = await this.usersRepository.findById(userId);
    
		if (!user) {
			throw new ResourceNotFoundError();
		}

		return { user };
	}
}

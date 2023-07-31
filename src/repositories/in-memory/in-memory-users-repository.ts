import { User, Prisma } from '@prisma/client';
import { randomUUID } from 'node:crypto';

import { IUsersRepository } from '../users-repository';

export class InMemoryUsersRepository implements IUsersRepository {
	public items: User[] = [];
	
	async findById(id: string): Promise<User | null> {
		const user = this.items.find(item => item.id === id);

		if (!user) {
			return null;
		}

		return user;
	}

	async findByEmail(email: string) {
		const user = this.items.find(item => item.email === email);

		if (!user) {
			return null;
		}

		return user;
	}

	async create(data: Prisma.UserCreateInput) {
		const { name, email, password_hash } = data;
		const user = {
			id: randomUUID(),
			name, 
			email, 
			password_hash,
			created_at: new Date()
		};

		this.items.push(user);

		return user;
	}
}

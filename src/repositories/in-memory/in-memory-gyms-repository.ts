import { Gym, Prisma } from '@prisma/client';

import { GymsRepository, IFindManyNearbyParams } from '../gyms-repository';
import { randomUUID } from 'crypto';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates';

export class InMemoryGymsRepository implements GymsRepository {
	public items: Gym[] = [];
	
	async findById(id: string): Promise<Gym | null> {
		const gym = this.items.find(item => item.id === id);

		if (!gym) {
			return null;
		}

		return gym;
	}

	async findManyNearby(params: IFindManyNearbyParams) {
		return this.items.filter(item => {
			const distance = getDistanceBetweenCoordinates(
				{ latitude: params.latitude, longitude: params.longitude },
				{ 
					latitude: item.latitude.toNumber(), 
					longitude: item.longitude.toNumber() 
				}
			);

			return distance < 10;
		});
	}

	async searchMany(query: string, page: number): Promise<Gym[]> {
		return this.items
			.filter(item => item.title.includes(query))
			.slice((page - 1) * 20, page * 20);
	}

	async create(data: Prisma.GymCreateInput) {
		const { id, title, description, latitude, longitude, phone } = data;

		const gym = {
			id: id ?? randomUUID(),
			title,
			description: description ?? null,
			latitude: new Prisma.Decimal(latitude.toString()),
			longitude: new Prisma.Decimal(longitude.toString()),
			phone: phone ?? null,
			created_at: new Date(),
		};

		this.items.push(gym);

		return gym;
	}
}

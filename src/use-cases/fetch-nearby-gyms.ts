import { Gym } from '@prisma/client';
import { GymsRepository } from '@/repositories/gyms-repository';

interface FetchNearbyGymsUseCaseRequest {
  userLatitude: number;
	userLongitude: number;
}

interface IFetchNearbyGymsUseCaseResponse {
  gyms: Gym[];
}

export class FetchNearbyGymsUseCase {
	constructor(private readonly gymsRepository: GymsRepository) {}

	async execute({
		userLatitude,
		userLongitude
	}: FetchNearbyGymsUseCaseRequest): Promise<IFetchNearbyGymsUseCaseResponse> {
		const gyms = await this.gymsRepository.findManyNearby({
			latitude: userLatitude,
			longitude: userLongitude
		});

		return { gyms };
	}
}

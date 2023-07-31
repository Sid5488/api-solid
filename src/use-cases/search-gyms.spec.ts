import { beforeEach, describe, expect, it } from 'vitest';

import { InMemoryGymsRepository } from 
	'@/repositories/in-memory/in-memory-gyms-repository';
import { SearchGymsUseCase } from './search-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe('Search gyms Use Case', () => {
	beforeEach(async () => {
		gymsRepository = new InMemoryGymsRepository();
		sut = new SearchGymsUseCase(gymsRepository);
	});

	it('should be able to search for gyms', async () => {
		await gymsRepository.create({
			title: 'JavaScript Gym',
			description: null,
			phone: null,
			latitude: 0,
			longitude: 0,
		});

		await gymsRepository.create({
			title: 'TypeScript Gym',
			description: null,
			phone: null,
			latitude: 0,
			longitude: 0,
		});

		const { gyms } = await sut.execute({ query: 'JavaScript', page: 1 });

		expect(gyms).toHaveLength(1);
		expect(gyms).toEqual([
			expect.objectContaining({ title: 'JavaScript Gym' }),
		]);
	});

	it('should be able to fetch paginated gyms search', async () => {
		for (let i = 1; i <= 22; i++) {
			await gymsRepository.create({
				title: `TypeScript Gym ${i}`,
				description: null,
				phone: null,
				latitude: 0,
				longitude: 0,
			});
		}

		const { gyms } = await sut.execute({
			query: 'TypeScript Gym',
			page: 2
		});

		expect(gyms).toHaveLength(2);
		// expect(gyms).toEqual([
		// 	expect.objectContaining({ title: 'TypeScript Gym 22' }),
		// ]);
	});
});

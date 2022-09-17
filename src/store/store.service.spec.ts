import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { StoreEntity } from './store.entity';
import { StoreService } from './store.service';
import { faker } from '@faker-js/faker';

describe('StoreService', () => {
  let service: StoreService;
  let repository: Repository<StoreEntity>;
  let storeList: StoreEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [StoreService],
    }).compile();

    service = module.get<StoreService>(StoreService);
    repository = module.get<Repository<StoreEntity>>(
      getRepositoryToken(StoreEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    storeList = [];
    for (let i = 0; i < 5; i++) {
      const store: StoreEntity = await repository.save({
        name: faker.company.name(),
        city: faker.lorem.sentence(),
        address: faker.lorem.sentence(),
        products: [],
      });
      storeList.push(store);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all stores', async () => {
    const stores: StoreEntity[] = await service.findAll();
    expect(stores).not.toBeNull();
    expect(stores).toHaveLength(storeList.length);
  });

  it('findOne should return a store by id', async () => {
    const storedStore: StoreEntity = storeList[0];
    const store: StoreEntity = await service.findOne(storedStore.id);
    expect(store).not.toBeNull();
    expect(store.name).toEqual(storedStore.name);
    expect(store.city).toEqual(storedStore.city);
    expect(store.address).toEqual(storedStore.address);
  });

  it('findOne should throw an exception for an invalid store', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The store with the given id was not found',
    );
  });

  it('create should return a new store', async () => {
    const store: StoreEntity = {
      id: '',
      name: faker.company.name(),
      city: faker.lorem.sentence(),
      address: faker.lorem.sentence(),
      products: [],
    };

    const newstore: StoreEntity = await service.create(store);
    expect(newstore).not.toBeNull();

    const storedStore: StoreEntity = await repository.findOne({
      where: { id: newstore.id },
    });
    expect(storedStore).not.toBeNull();
    expect(storedStore.name).toEqual(newstore.name);
    expect(storedStore.city).toEqual(newstore.city);
    expect(storedStore.address).toEqual(newstore.address);
  });

  it('update should modify a store', async () => {
    const store: StoreEntity = storeList[0];
    store.name = 'New store Name';
    store.city = 'New city';

    const updatedStore: StoreEntity = await service.update(store.id, store);
    expect(updatedStore).not.toBeNull();

    const storedStore: StoreEntity = await repository.findOne({
      where: { id: store.id },
    });
    expect(storedStore).not.toBeNull();
    expect(storedStore.name).toEqual(store.name);
    expect(storedStore.city).toEqual(store.city);
  });

  it('update should throw an exception for an invalid store', async () => {
    let store: StoreEntity = storeList[0];
    store = {
      ...store,
      name: 'New store Name',
      city: 'New City',
    };
    await expect(() => service.update('0', store)).rejects.toHaveProperty(
      'message',
      'The store with the given id was not found',
    );
  });

  it('delete should remove a store', async () => {
    const store: StoreEntity = storeList[0];
    await service.delete(store.id);

    const deletedStore: StoreEntity = await repository.findOne({
      where: { id: store.id },
    });
    expect(deletedStore).toBeNull();
  });

  it('delete should throw an exception for an invalid store', async () => {
    const store: StoreEntity = storeList[0];
    await service.delete(store.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The store with the given id was not found',
    );
  });
});

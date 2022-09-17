import { Test, TestingModule } from '@nestjs/testing';
import { StoreProductService } from './store-product.service';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StoreEntity } from '../store/store.entity';
import { ProductEntity } from '../product/product.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('StoreProductService', () => {
  let service: StoreProductService;
  let storeRepository: Repository<StoreEntity>;
  let productRepository: Repository<ProductEntity>;
  let product: ProductEntity;
  let storeList: StoreEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [StoreProductService],
    }).compile();

    service = module.get<StoreProductService>(StoreProductService);
    storeRepository = module.get<Repository<StoreEntity>>(
      getRepositoryToken(StoreEntity),
    );
    productRepository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    productRepository.clear();
    storeRepository.clear();

    storeList = [];
    for (let i = 0; i < 5; i++) {
      const store: StoreEntity = await storeRepository.save({
        name: faker.company.name(),
        city: faker.lorem.sentence(),
        address: faker.lorem.sentence(),
        products: [],
      });
      storeList.push(store);
    }

    product = await productRepository.save({
      name: faker.company.name(),
      price: faker.datatype.number(),
      type: faker.lorem.sentence(),
      stores: storeList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addStoreToProduct should add a product to a store', async () => {
    const newStore: StoreEntity = await storeRepository.save({
      name: faker.company.name(),
      city: faker.lorem.sentence(),
      address: faker.lorem.sentence(),
      products: [],
    });

    const newProduct: ProductEntity = await productRepository.save({
      name: faker.company.name(),
      price: faker.datatype.number(),
      type: faker.lorem.sentence(),
      stores: [],
    });

    const result: ProductEntity = await service.addStoreToProduct(
      newStore.id,
      newProduct.id,
    );

    expect(result.stores.length).toBe(1);
    expect(result.stores[0]).not.toBeNull();
    expect(result.stores[0].name).toBe(newStore.name);
    expect(result.stores[0].city).toBe(newStore.city);
    expect(result.stores[0].address).toBe(newStore.address);
  });

  it('addStoreToProduct should thrown exception for an invalid product', async () => {
    const newstore: StoreEntity = await storeRepository.save({
      name: faker.company.name(),
      city: faker.lorem.sentence(),
      address: faker.lorem.sentence(),
      products: [],
    });

    await expect(() =>
      service.addStoreToProduct(newstore.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('addStoreToProduct should throw an exception for an invalid store', async () => {
    const newProduct: ProductEntity = await productRepository.save({
      name: faker.company.name(),
      price: faker.datatype.number(),
      type: faker.lorem.sentence(),
      stores: [],
    });

    await expect(() =>
      service.addStoreToProduct('0', newProduct.id),
    ).rejects.toHaveProperty(
      'message',
      'The store with the given id was not found',
    );
  });

  it('findStoresFromProduct should return product by store', async () => {
    const store: StoreEntity = storeList[0];
    const storesProduct: StoreEntity[] = await service.findStoresFromProduct(
      product.id,
    );
    expect(storesProduct).not.toBeNull();
  });

  it('findStoresFromProduct should thrown exception for an invalid product', async () => {
    await expect(() =>
      service.findStoresFromProduct('0'),
    ).rejects.toHaveProperty(
      'message',
      'The store with the given id was not found',
    );
  });

  it('findStoreFromProduct should return product by store', async () => {
    const store: StoreEntity = storeList[0];
    const storedProduct: StoreEntity = await service.findStoreFromProduct(
      store.id,
      product.id,
    );
    expect(storedProduct).not.toBeNull();
    expect(storedProduct.name).toBe(store.name);
    expect(storedProduct.city).toBe(store.city);
    expect(storedProduct.address).toBe(store.address);
  });

  it('findStoreFromProduct should throw an exception for an invalid product', async () => {
    await expect(() =>
      service.findStoreFromProduct('0', product.id),
    ).rejects.toHaveProperty(
      'message',
      'The store with the given id was not found',
    );
  });

  it('findStoreFromProduct should throw an exception for an invalid store', async () => {
    const store: StoreEntity = storeList[0];
    await expect(() =>
      service.findStoreFromProduct(store.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('updateStoresFromProduct should return product by store', async () => {
    const ne = new StoreEntity();
    ne.name = 'New Store';
    ne.city = 'NCT';
    ne.address = 'New Address';
    const storedProduct: ProductEntity = await service.updateStoresFromProduct(
      product.id,
      ne,
    );
    expect(storedProduct).not.toBeNull();
  });

  it('updateStoresFromProduct should thrown an exception for an invalid product', async () => {
    await expect(() =>
      service.updateStoresFromProduct('0', new StoreEntity()),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('deleteStoreFromProduct should remove an product from a store', async () => {
    const store: StoreEntity = storeList[0];

    await service.deleteStoreFromProduct(store.id, product.id);

    const productStore: ProductEntity = await productRepository.findOne({
      where: { id: product.id },
      relations: ['stores'],
    });
    const deletedStore: StoreEntity = productStore.stores.find(
      (a) => a.id === store.id,
    );

    expect(deletedStore).toBeUndefined();
  });

  it('deleteStoreFromProduct should thrown an exception for an invalid product', async () => {
    const store: StoreEntity = storeList[0];
    await expect(() =>
      service.deleteStoreFromProduct(store.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('deleteStoreFromProduct should thrown an exception for an invalid store', async () => {
    await expect(() =>
      service.deleteStoreFromProduct('0', product.id),
    ).rejects.toHaveProperty(
      'message',
      'The store with the given id was not found',
    );
  });

  it('deleteStoreFromProduct should thrown an exception for an non asocciated product', async () => {
    const newStore: StoreEntity = await storeRepository.save({
      name: faker.company.name(),
      city: faker.lorem.sentence(),
      address: faker.lorem.sentence(),
      products: [],
    });

    await expect(() =>
      service.deleteStoreFromProduct(newStore.id, product.id),
    ).rejects.toHaveProperty(
      'message',
      'The store with the given id is not associated to the product',
    );
  });
});

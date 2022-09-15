import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { StoreEntity } from '../store/store.entity';
import { ProductEntity } from '../product/product.entity';

@Injectable()
export class StoreProductService {
  constructor(
    @InjectRepository(StoreEntity)
    private readonly storeRepository: Repository<StoreEntity>,

    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async addStoreToProduct(
    storeId: string,
    productId: string,
  ): Promise<StoreEntity> {
    const product: ProductEntity = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product)
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const store: StoreEntity = await this.storeRepository.findOne({
      where: { id: storeId },
      relations: ['products'],
    });
    if (!store)
      throw new BusinessLogicException(
        'The store with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    store.products = [...store.products, product];
    return await this.storeRepository.save(store);
  }

  async findStoresFromProduct(productId: string): Promise<StoreEntity[]> {
    const product: ProductEntity = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['stores'],
    });
    if (!product)
      throw new BusinessLogicException(
        'The store with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return product.stores;
  }

  async findStoreFromProduct(
    storeId: string,
    productId: string,
  ): Promise<StoreEntity> {
    const store: StoreEntity = await this.storeRepository.findOne({
      where: { id: storeId },
      relations: ['products'],
    });
    if (!store)
      throw new BusinessLogicException(
        'The store with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const product: ProductEntity = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product)
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const storeProduct: StoreEntity = product.stores.find(
      (e) => e.id === store.id,
    );

    if (!storeProduct)
      throw new BusinessLogicException(
        'The store with the given id is not associated to the product',
        BusinessError.PRECONDITION_FAILED,
      );

    return storeProduct;
  }

  async updateStoresFromProduct(productId: string, store: StoreEntity) {
    const product: ProductEntity = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['stores'],
    });
    if (!product)
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    product.stores.forEach((e) => store);
    await this.productRepository.save(product);
  }

  async deleteStoreFromProduct(storeId: string, productId: string) {
    const product: ProductEntity = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['stores'],
    });
    if (!product)
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const store: StoreEntity = await this.storeRepository.findOne({
      where: { id: storeId },
    });
    if (!store)
      throw new BusinessLogicException(
        'The store with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const storeProduct: StoreEntity = product.stores.find(
      (e) => e.id === store.id,
    );

    if (!storeProduct)
      throw new BusinessLogicException(
        'The store with the given id is not associated to the product',
        BusinessError.PRECONDITION_FAILED,
      );

    store.products = store.products.filter((e) => e.id !== storeId);
    await this.storeRepository.save(store);
  }
}

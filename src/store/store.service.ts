import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { StoreEntity } from './store.entity';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(StoreEntity)
    private readonly storeRepository: Repository<StoreEntity>,
  ) {}

  async findAll(): Promise<StoreEntity[]> {
    return await this.storeRepository.find();
  }

  async findOne(id: string): Promise<StoreEntity> {
    const store: StoreEntity = await this.storeRepository.findOne({
      where: { id },
    });
    if (!store)
      throw new BusinessLogicException(
        'The store with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return store;
  }

  async create(store: StoreEntity): Promise<StoreEntity> {
    if (!(await this.validCode(store.city.toUpperCase())))
      throw new BusinessLogicException(
        'The request are bad',
        BusinessError.BAD_REQUEST,
      );
    return await this.storeRepository.save(store);
  }

  async update(id: string, store: StoreEntity): Promise<StoreEntity> {
    if (!(await this.validCode(store.city.toUpperCase())))
      throw new BusinessLogicException(
        'The request are bad',
        BusinessError.BAD_REQUEST,
      );
    const persistedStore: StoreEntity = await this.storeRepository.findOne({
      where: { id },
    });
    if (!persistedStore)
      throw new BusinessLogicException(
        'The store with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return await this.storeRepository.save({
      ...persistedStore,
      ...store,
    });
  }

  async delete(id: string) {
    const store: StoreEntity = await this.storeRepository.findOne({
      where: { id },
    });
    if (!store)
      throw new BusinessLogicException(
        'The store with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.storeRepository.remove(store);
  }

  async validCode(code: string) {
    return /(?:\d*[A-Z]){3}/.test(code);
  }
}

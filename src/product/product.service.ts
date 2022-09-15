import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { ProductEntity } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async findAll(): Promise<ProductEntity[]> {
    return await this.productRepository.find();
  }

  async findOne(id: string): Promise<ProductEntity> {
    const product: ProductEntity = await this.productRepository.findOne({
      where: { id },
    });
    if (!product)
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return product;
  }

  async create(product: ProductEntity): Promise<ProductEntity> {
    if (!(await this.validateType(product.type)))
      throw new BusinessLogicException(
        'The request are bad',
        BusinessError.BAD_REQUEST,
      );
    return await this.productRepository.save(product);
  }

  async update(id: string, product: ProductEntity): Promise<ProductEntity> {
    if (!(await this.validateType(product.type)))
      throw new BusinessLogicException(
        'The request are bad',
        BusinessError.BAD_REQUEST,
      );
    const persistedProduct: ProductEntity =
      await this.productRepository.findOne({
        where: { id },
      });
    if (!persistedProduct)
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return await this.productRepository.save({
      ...persistedProduct,
      ...product,
    });
  }

  async delete(id: string) {
    const product: ProductEntity = await this.productRepository.findOne({
      where: { id },
    });
    if (!product)
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.productRepository.remove(product);
  }

  async validateType(type: string) {
    return (
      ProductEnum.PERISHABLE.toLowerCase() === type.toLowerCase() ||
      ProductEnum.NON_PERISHABLE.toLowerCase() === type.toLowerCase()
    );
  }
}

enum ProductEnum {
  PERISHABLE = 'perecedero',
  NON_PERISHABLE = 'no perecedero',
}

import { Module } from '@nestjs/common';
import { StoreProductService } from './store-product.service';
import { StoreProductController } from './store-product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreEntity } from '../store/store.entity';
import { ProductEntity } from '../product/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StoreEntity, ProductEntity])],
  providers: [StoreProductService],
  controllers: [StoreProductController],
})
export class StoreProductModule {}

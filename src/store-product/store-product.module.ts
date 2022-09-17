import { Module } from '@nestjs/common';
import { StoreProductService } from './store-product.service';
import { StoreProductController } from './store-product.controller';

@Module({
  providers: [StoreProductService],
  controllers: [StoreProductController]
})
export class StoreProductModule {}

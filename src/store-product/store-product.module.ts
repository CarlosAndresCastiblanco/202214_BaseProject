import { Module } from '@nestjs/common';
import { StoreProductService } from './store-product.service';

@Module({
  providers: [StoreProductService]
})
export class StoreProductModule {}

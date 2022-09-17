import {
  Controller,
  UseInterceptors,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { StoreProductService } from './store-product.service';
import { StoreDto } from '../store/store.dto';
import { StoreEntity } from '../store/store.entity';

@Controller('products')
@UseInterceptors(BusinessErrorsInterceptor)
export class StoreProductController {
  constructor(private readonly storeProductService: StoreProductService) {}

  @Post(':productId/stores/:storeId')
  async addStoreToProduct(
    @Param('productId') productId: string,
    @Param('storeId') storeId: string,
  ) {
    return await this.storeProductService.addStoreToProduct(storeId, productId);
  }

  @Get(':productId/stores')
  async findStoresFromProduct(@Param('productId') productId: string) {
    return await this.storeProductService.findStoresFromProduct(productId);
  }

  @Get(':productId/stores/:storeId')
  async findStoreFromProduct(
    @Param('productId') productId: string,
    @Param('storeId') storeId: string,
  ) {
    return await this.storeProductService.findStoreFromProduct(
      storeId,
      productId,
    );
  }

  @Put(':productId/stores')
  async updateStoresFromProduct(
    @Body() storeDto: StoreDto,
    @Param('productId') productId: string,
  ) {
    const store: StoreEntity = plainToInstance(StoreEntity, storeDto);
    return await this.storeProductService.updateStoresFromProduct(
      productId,
      store,
    );
  }

  @Delete(':productId/stores/:storeId')
  @HttpCode(204)
  async deleteStoresFromProduct(
    @Param('productId') productId: string,
    @Param('storeId') storeId: string,
  ) {
    return await this.storeProductService.deleteStoreFromProduct(
      storeId,
      productId,
    );
  }
}

import {
  Controller,
  UseInterceptors,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ProductService } from './product.service';
import { ProductEntity } from './product.entity';
import { ProductDto } from './product.dto';
import { plainToInstance } from 'class-transformer';

@Controller('products')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll() {
    return await this.productService.findAll();
  }

  @Get(':productId')
  async findOne(@Param('productId') productId: string) {
    return await this.productService.findOne(productId);
  }

  @Post()
  async create(@Body() productDto: ProductDto) {
    const product: ProductEntity = plainToInstance(ProductEntity, productDto);
    return await this.productService.create(product);
  }

  @Put(':productId')
  async update(
    @Param('productId') productId: string,
    @Body() productDto: ProductDto,
  ) {
    const product: ProductEntity = plainToInstance(ProductEntity, productDto);
    return await this.productService.update(productId, product);
  }

  @Delete(':productId')
  async delete(@Param('productId') productId: string) {
    return await this.productService.delete(productId);
  }
}

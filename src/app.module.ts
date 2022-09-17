import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { StoreModule } from './store/store.module';
import { StoreProductModule } from './store-product/store-product.module';
import { ProductEntity } from './product/product.entity';
import { StoreEntity } from './store/store.entity';

@Module({
  imports: [
    ProductModule,
    StoreModule,
    StoreProductModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'gastronomic_culture',
      entities: [ProductEntity, StoreEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

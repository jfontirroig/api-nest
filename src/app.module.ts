import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiModule } from './api/api.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/ubid'),  // Configuración de la base de datos
    ApiModule,    // Importa el módulo de la API
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { Projects, ProjectsSchema } from '../models/projects.schema';
import { LoggerService } from '../logger.service';  // Tu LoggerService

@Module({
  imports: [MongooseModule.forFeature([{ name: Projects.name, schema: ProjectsSchema }])],
  controllers: [ApiController],
  providers: [ApiService, LoggerService],
})
export class ApiModule {}

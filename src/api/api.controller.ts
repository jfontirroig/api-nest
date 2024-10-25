import { Controller, Post, Body, Headers, Logger } from '@nestjs/common';
import { ApiService } from './api.service';
import { LoggerService } from '../logger.service';  // Tu servicio personalizado


@Controller('nest-api-session')
export class ApiController {
  constructor(
    private readonly loggerService: LoggerService, // Inyección del servicio de logger
    private readonly apiService: ApiService         // Inyección del ApiService
  ) {}

  @Post('sessiondata')
  async getSessionData(
    @Body('session') session: string,
    @Body('realm') realm: string,
    @Body('client') client: string,
    @Body('administrator') administrator: string,
    @Headers('authorization') authorization: string,
    @Headers('apikey') apikey: string,
  ) {
    const response = await this.apiService.sessiondata(session, realm, client, administrator, authorization, apikey);
    return response;
  }

  @Post('userdata')
  async getUserData(
    @Body('username') username: string,
    @Body('realm') realm: string,
    @Body('client') client: string,
    @Body('administrator') administrator: string,
    @Headers('authorization') authorization: string,
    @Headers('apikey') apikey: string,
  ) {
    const response = await this.apiService.userdata(username, realm, client, administrator, authorization, apikey);
    return response;
  }
}

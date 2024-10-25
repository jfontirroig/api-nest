import { Test, TestingModule } from '@nestjs/testing';
import { ApiController } from './api/api.controller';
import { ApiService } from './api/api.service';
import { LoggerService } from './logger.service';  // Tu servicio personalizado

describe('ApiController', () => {
  let apiController: ApiController;
  let apiService: ApiService;
  let loggerService: LoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiController],
      providers: [
        {
          provide: ApiService,
          useValue: {
            sessiondata: jest.fn(), // Mock para el método sessiondata
            userdata: jest.fn(),    // Mock para el método userdata
          },
        },
        {
          provide: LoggerService,
          useValue: {
            info: jest.fn(),  // Mock para el método info del LoggerService
          },
        },
      ],
    }).compile();

    apiController = module.get<ApiController>(ApiController);
    apiService = module.get<ApiService>(ApiService);
    loggerService = module.get<LoggerService>(LoggerService);
  });

  describe('getSessionData', () => {
    it('should return session data', async () => {
      // Configurar los mocks
      const mockResponse = { success: 200, message: 'Success Read Session', code: 1, data: { session: 'test-session' } };
      jest.spyOn(apiService, 'sessiondata').mockResolvedValue(mockResponse);

      const session = 'test-session';
      const realm = 'test-realm';
      const client = 'test-client';
      const authorization = 'test-authorization';

      // Ejecutar el endpoint y obtener la respuesta
      const response = await apiController.getSessionData(session, realm, client, authorization);

      // Verificar que el logger se haya llamado con la información correcta, ajustando para manejar comillas
      expect(loggerService.info).toHaveBeenCalledWith(
        `api.controller --> sessiondata: "${session}", realm: ${realm}, client: ${client}, authorization: ${authorization}`
      );

      // Verificar que la respuesta es la correcta
      expect(response).toEqual(mockResponse);

      // Verificar que el servicio se haya llamado con los parámetros correctos
      expect(apiService.sessiondata).toHaveBeenCalledWith(session, realm, client, authorization);
    });

    it('should handle errors in sessiondata', async () => {
      const mockError = { success: 404, message: 'Failure Read Session', code: 2, data: 'Failure Read Session' };
      jest.spyOn(apiService, 'sessiondata').mockRejectedValue(mockError);

      const session = 'invalid-session';
      const realm = 'test-realm';
      const client = 'test-client';
      const authorization = 'test-authorization';

      // Verificar que la función sessiondata devuelve un error
      await expect(apiController.getSessionData(session, realm, client, authorization)).rejects.toEqual(mockError);
    });
  });

  describe('getUserData', () => {
    it('should return user data', async () => {
      // Configurar los mocks
      const mockResponse = { success: 200, message: 'Success Read Profile', code: 1, data: { username: 'test-user' } };
      jest.spyOn(apiService, 'userdata').mockResolvedValue(mockResponse);

      const username = 'test-user';
      const realm = 'test-realm';
      const client = 'test-client';
      const authorization = 'test-authorization';

      // Ejecutar el endpoint y obtener la respuesta
      const response = await apiController.getUserData(username, realm, client, authorization);

      // Verificar que el logger se haya llamado con la información correcta, ajustando para manejar comillas
      expect(loggerService.info).toHaveBeenCalledWith(
        `api.controller --> userdata: "${username}", realm: ${realm}, client: ${client}, authorization: ${authorization}`
      );

      // Verificar que la respuesta es la correcta
      expect(response).toEqual(mockResponse);

      // Verificar que el servicio se haya llamado con los parámetros correctos
      expect(apiService.userdata).toHaveBeenCalledWith(username, realm, client, authorization);
    });

    it('should handle errors in userdata', async () => {
      const mockError = { success: 404, message: 'Failure Read Profile', code: 3, data: 'Failure Read Profile' };
      jest.spyOn(apiService, 'userdata').mockRejectedValue(mockError);

      const username = 'invalid-user';
      const realm = 'test-realm';
      const client = 'test-client';
      const authorization = 'test-authorization';

      // Verificar que la función userdata devuelve un error
      await expect(apiController.getUserData(username, realm, client, authorization)).rejects.toEqual(mockError);
    });
  });
});

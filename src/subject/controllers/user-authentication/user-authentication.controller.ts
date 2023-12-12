import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { failure } from 'rilata2/src/common/result/failure';
import { success } from 'rilata2/src/common/result/success';
import { TelegramAuthDTO } from 'workshop-domain/src/subject/domain-data/user/user-authentification.a-params';
import { controllerUtility } from '../controller.utility';

export const WORKSHOP_BACKEND_URL_PREFIX = 'api/';
export const USER_AUTHENTICATION_RENEWAL_ENDPOINT = `${WORKSHOP_BACKEND_URL_PREFIX}auth/refresh-token`;

// Класс контроллера для обработки аутентификации пользователя
@Controller(USER_AUTHENTICATION_RENEWAL_ENDPOINT)
export class UserAuthenticationController {
  // Обработка POST-запросов для аутентификации пользователя
  @Post()
  async authentication(
    // Извлечение запроса аутентификации пользователя из тела запроса
    @Body() userAuthenticationQuery: TelegramAuthDTO,
    // Объект ответа Express для управления HTTP-ответом
    @Res({ passthrough: true }) response: Response,
    // Объект запроса Express для доступа к деталям входящего HTTP-запроса
    @Req() req: Request,
  ): Promise<void> {
    // Создание экземпляра использования UserAuthenticationUC
    const useCase = UserAuthenticationUC.instance(this.resolver);

    // Конфигурация параметров использования
    const ucOptions: UserAuthenticationUCOptions = {
      input: userAuthenticationQuery,
      caller: req.user,
    };

    // Выполнение использования для аутентификации пользователя
    const useCaseResult = await useCase.execute(ucOptions);

    // Обработка успешного сценария
    if (useCaseResult.isSuccess()) {
      // Установка refresh-токена как куки в ответе
      response.cookie(
        'refreshToken',
        `${useCaseResult.value.attrs.refresh}`,
        { sameSite: 'lax', httpOnly: true, secure: false },
      );
    }

    // Подготовка результата для бэкенда на основе результата использования
    const backendResult: UserAuthenticationUCOut = useCaseResult.isFailure()
      ? failure(useCaseResult.value) : success(useCaseResult.value.attrs.access);

    // Установка HTTP-статуса ответа на основе результата бэкенда
    if (backendResult.isSuccess()) {
      response.status(HttpStatus.CREATED);
    } else {
      response.status(controllerUtility.defineUseCaseFailureResultHTTPStatus(backendResult));
    }

    // Отправка преобразованного результата как HTTP-ответ
    response.send(controllerUtility.convertToResultDTO(backendResult));
  }
}

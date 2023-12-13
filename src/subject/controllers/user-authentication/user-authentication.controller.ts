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
import { AuthenticationUserUC } from 'subject/use-cases/user-authentication/use-case';
import { AuthenticationUserErrors, AuthenticationUserInputOptions, AuthenticationUserSuccessOut } from 'subject/use-cases/user-authentication/use-case-params';
import { RequestCY } from 'craft-yard-backend/src/app/jwt/types';
import { TelegramAuthDTO } from 'workshop-domain/src/subject/domain-data/user/user-authentification/a-params';
import { UseCaseOut, controllerUtility } from '../controller.utility';

export const WORKSHOP_BACKEND_URL_PREFIX = 'api/';
export const USER_AUTHENTICATION_RENEWAL_ENDPOINT = `${WORKSHOP_BACKEND_URL_PREFIX}auth/refresh-token`;
export const refreshTokenCookieName = 'refreshToken';

@Controller(USER_AUTHENTICATION_RENEWAL_ENDPOINT)
export class UserAuthenticationController {
  @Post()
  async authentication(
    @Body() telegramAuthDTO: TelegramAuthDTO,
    @Res({ passthrough: true }) response: Response,
    @Req() req: RequestCY,
  ): Promise<void> {
    const useCase = new AuthenticationUserUC();

    const ucOptions: AuthenticationUserInputOptions = {
      query: {
        attrs: telegramAuthDTO,
        name: 'AuthenticationUserUCQuery',
      },
      caller: req.user,
    };

    const useCaseResult = await useCase.execute(ucOptions);

    const backendResult: UseCaseOut<
    AuthenticationUserErrors,
    AuthenticationUserSuccessOut
    > = useCaseResult.isFailure()
      ? failure(useCaseResult.value) : success(useCaseResult.value);

    if (backendResult.isSuccess()) {
      response.status(HttpStatus.CREATED);
    } else {
      response.status(controllerUtility.defineUseCaseFailureResultHTTPStatus(backendResult));
    }

    response.send(controllerUtility.convertToResultDTO(backendResult));
  }
}

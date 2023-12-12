import { Caller } from 'rilata2/src/app/caller';
import { ErrorDod, UseCaseQueryDod } from 'rilata2/src/domain/domain-object-data/common-types';
import { QueryUseCaseParams } from 'rilata2/src/app/use-case/types';
import { TelegramAuthDTO } from 'workshop-domain/src/subject/domain-data/user/user-authentification.a-params';
import { JWTTokens } from 'rilata2/src/app/jwt/types';
import { UseCaseBaseErrors } from 'rilata2/src/app/use-case/error-types';

export type AuthenticationUserUCQuery = UseCaseQueryDod<TelegramAuthDTO, 'AuthenticationUserUCQuery'>

export type AuthenticationUserInputOptions = {
  query: AuthenticationUserUCQuery,
  caller: Caller;
}

export type AuthenticationUserSuccessOut = JWTTokens;

export type AuthentificationUserErrors = ErrorDod<{
  text: 'Пользователь по такому TelegramID не зарегистрирован в приложений',
  hint: Record<never, unknown>
  },
  'AuthenticationUserErrors'
>;

export type AuthenticationUserErrors = AuthentificationUserErrors;

export type AuthenticationUserUCParams = QueryUseCaseParams<
  AuthenticationUserInputOptions, AuthenticationUserSuccessOut, AuthenticationUserErrors
>

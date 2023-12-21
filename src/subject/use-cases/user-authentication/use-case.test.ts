/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  describe, test, expect, spyOn, beforeAll, afterAll,
} from 'bun:test';
import { JWTTokens } from 'rilata2/src/app/jwt/types';
import { TokenCreator } from 'rilata2/src/app/jwt/token-creator.interface';
import { TelegramAuthDTO } from 'workshop-domain/src/subject/domain-data/user/user-authentification/a-params';
import { UserAuthentificationInputOptions } from 'workshop-domain/src/subject/domain-data/user/user-authentification/uc-params';
import { UserRepository } from 'workshop-domain/src/subject/domain-object/user/repository';
import { UserAttrs } from 'workshop-domain/src/subject/domain-data/user/params';
import { TelegramId } from 'workshop-domain/src/types';
import { UserAR } from 'workshop-domain/src/subject/domain-object/user/a-root';
import { UserAuthentificationUC } from './use-case';
import { SubjectUseCaseFixtures } from '../fixtures';

describe('user authentification use case tests', () => {
  const getNowOriginal = UserAR.prototype.getNowDate;
  beforeAll(() => {
    UserAR.prototype.getNowDate = () => new Date('2021-01-01');
  });

  afterAll(() => {
    UserAR.prototype.getNowDate = getNowOriginal;
  });

  const sut = new UserAuthentificationUC();
  const resolver = new SubjectUseCaseFixtures.ResolverMock();
  const tokenCreatorMock = {
    createToken(): JWTTokens {
      return {
        accessToken: 'some access token',
        refreshToken: 'some refresh token',
      };
    },
  };

  const resolveRealisationMock = spyOn(resolver, 'getRealisation').mockImplementation((key: unknown) => {
    if (key === 'botToken') return 'some bot token';
    if (key === TokenCreator) return tokenCreatorMock;
    throw Error('not valid key');
  });
  sut.init(resolver);

  const authQuery: TelegramAuthDTO = {
    id: 694528239,
    auth_date: new Date('2021-01-01').getTime() - 1000,
    hash: 'f48f14a7c9ceff0b320a7233a6395299e67418cce6b0c04246eb1eecac35f7b6',
  };
  const inputOptions: UserAuthentificationInputOptions = {
    actionDod: {
      actionName: 'userAuthentification',
      body: authQuery,
    },
    caller: {
      type: 'AnonymousUser',
      requestID: '',
    },
  };

  test('успех, возвращен сгенерированный токен', async () => {
    const findTelegramIdMock = spyOn(
      resolver.getRepository(UserRepository),
      'findByTelegramId',
    ).mockImplementation(
      async (telegramId: TelegramId) => {
        const users: UserAttrs[] = [{
          type: 'client',
          telegramId: 694528239,
          userId: '65ec0a41-4e27-4130-ad9b-216b9cfd569f',
          userProfile: {
            firstName: 'Jack',
            lastName: 'Smith',
          },
        }];
        return users.filter((user) => user.telegramId === telegramId);
      },
    );

    const result = await sut.execute(inputOptions);
    expect(result.isSuccess()).toBe(true);
    expect(result.value).toEqual({
      accessToken: 'some access token',
      refreshToken: 'some refresh token',
    });
    expect(resolveRealisationMock).toHaveBeenCalledTimes(2);
    expect(resolveRealisationMock.mock.calls[0][0]).toBe('botToken');
    expect(resolveRealisationMock.mock.calls[1][0]).toBe(TokenCreator);

    expect(findTelegramIdMock).toHaveBeenCalledTimes(1);
    expect(findTelegramIdMock.mock.calls[0][0]).toBe(694528239);
  });

  test('провал, не прошла валидация', async () => {
    const notValid: UserAuthentificationInputOptions = {
      ...inputOptions,
      actionDod: {
        actionName: 'userAuthentification',
        body: {
          id: -694528239,
          auth_date: new Date('2021-01-01').getTime() - 1000,
          hash: 'f48f14a7c9ceff0b320a7233a6395299e67418cce6b0c04246eb1eecac35f7b6',
        },
      },
    };
    const result = await sut.execute(notValid);
    expect(result.isFailure()).toBe(true);
    expect(result.value).toEqual({
      name: 'Validation Error',
      domainType: 'error',
      errorType: 'app-error',
      errors: {
        userAuthentification: {
          id: [
            {
              text: 'Число должно быть положительным',
              hint: {},
              name: 'PositiveNumberValidationRule',
            },
          ],
        },
      },
    });
  });

  test('провал, запрос досупен только для неавторизованных пользователей', async () => {
    const notValid: UserAuthentificationInputOptions = {
      ...inputOptions,
      caller: {
        type: 'DomainUser',
        userId: 'any user id',
        requestID: '',
      },
    };
    const result = await sut.execute(notValid);
    expect(result.isFailure()).toBe(true);
    expect(result.value).toEqual({
      name: 'Permission denied',
      locale: {
        text: 'Действие не доступно',
        hint: {
          allowedOnlyFor: ['AnonymousUser'],
        },
      },
      errorType: 'domain-error',
      domainType: 'error',
    });
  });
});

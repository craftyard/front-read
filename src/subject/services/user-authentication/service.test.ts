/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  describe, test, expect, spyOn, beforeAll, afterAll,
} from 'bun:test';
import { JWTTokens } from 'rilata/src/app/jwt/types';
import { TokenCreator } from 'rilata/src/app/jwt/token-creator.interface';
import { uuidUtility } from 'rilata/src/common/utils/uuid/uuid-utility';
import { dtoUtility } from 'rilata/src/common/utils/dto/dto-utility';
import { TelegramAuthDTO } from 'cy-domain/src/subject/domain-data/user/user-authentification/a-params';
import { UserCmdRepository } from 'cy-domain/src/subject/domain-object/user/cmd-repository';
import { testUsersRecords } from 'cy-domain/src/subject/domain-object/user/json-impl/fixture';
import { TelegramId } from 'cy-domain/src/types';
import { UserAuthentificationActionDod } from 'cy-domain/src/subject/domain-data/user/user-authentification/s-params';
import { UserAR } from 'cy-domain/src/subject/domain-object/user/a-root';
import { UserAuthentificationService } from './service';
import { SubjectUseCaseFixtures } from '../fixtures';

describe('user authentification use case tests', () => {
  const getNowOriginal = UserAR.prototype.getNowDate;
  beforeAll(() => {
    UserAR.prototype.getNowDate = () => new Date('2021-01-01');
  });

  afterAll(() => {
    UserAR.prototype.getNowDate = getNowOriginal;
  });

  const sut = new UserAuthentificationService();
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

  const findByTelegramIdMock = spyOn(
    resolver.getRepository(UserCmdRepository),
    'findByTelegramId',
  ).mockImplementation(
    async (telegramId: TelegramId) => testUsersRecords
      .filter((userRecord) => userRecord.telegramId === telegramId)
      .map((userRecord) => {
        const userAttrs = dtoUtility.excludeAttrs(userRecord, 'version');
        return new UserAR(userAttrs, userRecord.version, resolver.getLogger());
      }),
  );

  sut.init(resolver);

  const oneUserFindedAuthQuery: TelegramAuthDTO = {
    id: 3290593910,
    auth_date: new Date('2021-01-01').getTime() - 1000,
    hash: '69d4ebba0b28a1b88634ef973918deffcf75d08d87f683677efb18baebc73c4d',
  };
  const oneUserFindedActionDod: UserAuthentificationActionDod = {
    meta: {
      name: 'userAuthentification',
      actionId: uuidUtility.getNewUUID(),
      domainType: 'action',
    },
    attrs: oneUserFindedAuthQuery,
  };

  const manyUserFindedAuthQuery: TelegramAuthDTO = {
    id: 5436134100,
    auth_date: new Date('2021-01-01').getTime() - 1000,
    hash: '94e3af7a0604b8494aa812f17159321958220291916aa78462c7cbc153d14056',
  };

  test('успех, возвращен сгенерированный токен для одного сотрудника', async () => {
    resolveRealisationMock.mockClear();
    findByTelegramIdMock.mockClear();

    const result = await sut.execute(oneUserFindedActionDod);
    expect(result.isSuccess()).toBe(true);
    expect(result.value).toEqual({
      accessToken: 'some access token',
      refreshToken: 'some refresh token',
    });

    expect(findByTelegramIdMock).toHaveBeenCalledTimes(1);
    expect(findByTelegramIdMock.mock.calls[0][0]).toBe(3290593910);

    expect(resolveRealisationMock).toHaveBeenCalledTimes(2);
    expect(resolveRealisationMock.mock.calls[0][0]).toBe('botToken');
    expect(resolveRealisationMock.mock.calls[1][0]).toBe(TokenCreator);
  });

  test('провал, случаи когда один сотрудник и один клиент', async () => {
    const findByTelegramIdTwoUserMock = spyOn(
      resolver.getRepository(UserCmdRepository),
      'findByTelegramId',
    ).mockImplementationOnce(
      async (telegramId: TelegramId) => {
        const shiftedUserRecords = dtoUtility.deepCopy(testUsersRecords).slice(1);
        return shiftedUserRecords
          .filter((userRecord) => userRecord.telegramId === telegramId)
          .map((userRecord) => {
            const userAttrs = dtoUtility.excludeAttrs(userRecord, 'version');
            return new UserAR(userAttrs, userRecord.version, resolver.getLogger());
          });
      },
    );
    findByTelegramIdTwoUserMock.mockClear();
    const manyUserFindedActionDod = { ...oneUserFindedActionDod };
    manyUserFindedActionDod.attrs = manyUserFindedAuthQuery;

    const result = await sut.execute(manyUserFindedActionDod);
    expect(result.isFailure()).toBe(true);
    expect(result.value).toEqual({
      locale: {
        text: 'У вас с одним аккаунтом telegram имеется много аккаунтов, к сожалению сейчас это не поддерживается. Обратитесь в техподдержку, чтобы вам помогли решить эту проблему.',
        hint: {
          telegramId: 5436134100,
        },
      },
      meta: {
        name: 'ManyAccountNotSupportedError',
        errorType: 'domain-error',
        domainType: 'error',
      },
    });

    expect(findByTelegramIdTwoUserMock).toHaveBeenCalledTimes(1);
    expect(findByTelegramIdTwoUserMock.mock.calls[0][0]).toBe(5436134100);
  });

  test('провал, два сотрудника и один клиент, функционал еще не реализован', async () => {
    findByTelegramIdMock.mockClear();
    const manyUserFindedActionDod = { ...oneUserFindedActionDod };
    manyUserFindedActionDod.attrs = manyUserFindedAuthQuery;

    const result = await sut.execute(manyUserFindedActionDod);
    expect(result.isFailure()).toBe(true);
    expect(result.value).toEqual({
      locale: {
        text: 'У вас с одним аккаунтом telegram имеется много аккаунтов, к сожалению сейчас это не поддерживается. Обратитесь в техподдержку, чтобы вам помогли решить эту проблему.',
        hint: {
          telegramId: 5436134100,
        },
      },
      meta: {
        name: 'ManyAccountNotSupportedError',
        errorType: 'domain-error',
        domainType: 'error',
      },
    });

    expect(findByTelegramIdMock).toHaveBeenCalledTimes(1);
    expect(findByTelegramIdMock.mock.calls[0][0]).toBe(5436134100);
  });

  test('провал, случай когда пользователь не найден', async () => {
    findByTelegramIdMock.mockClear();
    const notFoundUserActionDod = { ...oneUserFindedActionDod };
    notFoundUserActionDod.attrs.id = 67932088504;

    const result = await sut.execute(notFoundUserActionDod);
    expect(result.isFailure()).toBe(true);
    expect(result.value).toEqual({
      locale: {
        text: 'У вас нет аккаунта.',
        hint: {
          telegramId: 67932088504,
        },
      },
      meta: {
        name: 'TelegramUserDoesNotExistError',
        errorType: 'domain-error',
        domainType: 'error',
      },
    });

    expect(findByTelegramIdMock).toHaveBeenCalledTimes(1);
    expect(findByTelegramIdMock.mock.calls[0][0]).toBe(67932088504);
  });

  test('провал, не прошла валидация', async () => {
    const notValid: UserAuthentificationActionDod = {
      ...oneUserFindedActionDod,
      attrs: {
        id: -694528239,
        auth_date: new Date('2021-01-01').getTime() - 1000,
        hash: 'f48f14a7c9ceff0b320a7233a6395299e67418cce6b0c04246eb1eecac35f7b6',
      },
    };

    const result = await sut.execute(notValid);
    expect(result.isFailure()).toBe(true);
    expect(result.value).toEqual({
      meta: {
        name: 'Validation error',
        domainType: 'error',
        errorType: 'app-error',
      },
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
    const result = await sut.execute(oneUserFindedActionDod);
    expect(result.isFailure()).toBe(true);
    expect(result.value).toEqual({
      locale: {
        text: 'Действие не доступно',
        hint: {
          allowedOnlyFor: ['AnonymousUser'],
        },
      },
      meta: {
        name: 'Permission denied',
        errorType: 'domain-error',
        domainType: 'error',
      },
    });
  });
});

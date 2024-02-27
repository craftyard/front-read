/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  describe, test, expect, spyOn, afterEach,
} from 'bun:test';
import { GetUserActionDod, GetingUserOut } from 'cy-domain/src/subject/domain-data/user/get-user/s-params';
import { UserAttrs } from 'cy-domain/src/subject/domain-data/user/params';
import { setAndGetTestStoreDispatcher } from 'rilata/tests/fixtures/test-thread-store-mock';
import { resolver } from 'rilata/tests/fixtures/test-resolver-mock';
import { UuidType } from 'rilata/src/common/types';
import { success } from 'rilata/src/common/result/success';
import { dtoUtility } from 'rilata/src/common/utils/dto';
import { failure } from 'rilata/src/common/result/failure';
import { dodUtility } from 'rilata/src/common/utils/domain-object/dod-utility';
import { UserReadRepository } from 'cy-domain/src/subject/domain-object/user/read-repository';
import { SubjectServiceFixtures as fixtures } from '../fixtures';
import { GettingUserService } from './service';

describe('тесты для use-case getUser', () => {
  const sut = new GettingUserService();
  sut.init(resolver);
  const user: UserAttrs = {
    userId: 'fa91a299-105b-4fb0-a056-92634249130c',
    telegramId: 5436134100,
    type: 'employee',
    userProfile: {
      firstName: 'Jack',
      lastName: 'Smith',
    },
  };
  const actionId: UuidType = 'pb8a83cf-25a3-2b4f-86e1-2744de6d8374';
  const validActionDod: GetUserActionDod = {
    meta: {
      name: 'getUser',
      actionId,
      domainType: 'action',
    },
    attrs: {
      userId: 'fa91a299-105b-4fb0-a056-92634249130c',
    },
  };

  const userRepo = fixtures.resolverGetUserWorkshopRepoMock(UserReadRepository) as
  UserReadRepository;
  const repoGetUserMock = spyOn(userRepo, 'getUser');

  afterEach(() => {
    repoGetUserMock.mockClear();
  });

  test('успех, запрос для пользователя нормально проходит', async () => {
    repoGetUserMock.mockResolvedValueOnce(success(dtoUtility.deepCopy(user)));
    setAndGetTestStoreDispatcher(actionId);
    const result = await sut.execute(dtoUtility.deepCopy(validActionDod));
    expect(result.isSuccess()).toBe(true);
    expect(result.value as GetingUserOut).toEqual(user);
    expect(repoGetUserMock).toHaveBeenCalledTimes(1);
    expect(repoGetUserMock.mock.calls[0][0]).toEqual(
      'fa91a299-105b-4fb0-a056-92634249130c',
    );
    repoGetUserMock.mockClear();
  });
  test('провал, данный пользователь не существует', async () => {
    setAndGetTestStoreDispatcher(actionId);
    const notValidInputOpt = {
      ...validActionDod,
      attrs: { userId: 'dd91a299-105b-4fb0-a056-9263429433c4' }, // not valid
    };
    repoGetUserMock.mockResolvedValueOnce(failure(dodUtility.getDomainErrorByType(
      'UserDoesNotExistError',
      'Такого пользователя не существует',
      { userId: 'dd91a299-105b-4fb0-a056-9263429433c4' },
    )));
    const result = await sut.execute(notValidInputOpt);
    expect(result.isFailure()).toBe(true);
    expect(result.value).toEqual({
      locale: {
        text: 'Такого пользователя не существует',
        hint: {
          userId: 'dd91a299-105b-4fb0-a056-9263429433c4',
        },
      },
      name: 'UserDoesNotExistError',
      meta: {
        errorType: 'domain-error',
        domainType: 'error',
      },
    });
    repoGetUserMock.mockClear();
  });
  test('провал, запрещен доступ неавторизованному пользователю', async () => {
    setAndGetTestStoreDispatcher(actionId, {
      type: 'AnonymousUser',
    });
    const result = await sut.execute(dtoUtility.deepCopy(validActionDod));
    expect(result.isFailure()).toBe(true);
    expect(result.value).toEqual({
      locale: {
        text: 'Действие не доступно',
        hint: {
          allowedOnlyFor: ['DomainUser'],
        },
      },
      name: 'Permission denied',
      meta: {
        errorType: 'domain-error',
        domainType: 'error',
      },
    });
  });

  test('провал, не прошла валидация', async () => {
    setAndGetTestStoreDispatcher(actionId);
    const notValidInputOpt = {
      ...validActionDod,
      attrs: { userId: 'fa91a299-105b-4fb0-a056-9263429133c' }, // not valid
    };
    const result = await sut.execute(notValidInputOpt);
    expect(result.isFailure()).toBe(true);
    expect(result.value).toEqual({
      name: 'Validation error',
      meta: {
        domainType: 'error',
        errorType: 'app-error',
      },
      errors: {
        getUser: {
          userId: [
            {
              text: 'Значение должно соответствовать формату UUID',
              hint: {},
              name: 'UUIDFormatValidationRule',
            },
          ],
        },
      },
    });
  });
});

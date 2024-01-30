/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    describe, test, expect, spyOn, afterEach,
  } from 'bun:test';
import { GetUserActionDod, GetingUserOut } from 'cy-domain/src/subject/domain-data/user/get-user/s-params';
import { UserAttrs } from 'cy-domain/src/subject/domain-data/user/params';
import { setAndGetTestStoreDispatcher } from 'rilata/tests/fixtures/test-thread-store-mock';
import { resolver } from 'rilata/tests/fixtures/test-resolver-mock';
import { GettingUserService } from './service';
import { SubjectServiceFixtures as fixtures } from '../fixtures';
import { UuidType } from 'rilata/src/common/types';
import { success } from 'rilata/src/common/result/success';
import { dtoUtility } from 'rilata/src/common/utils/dto';

describe('тесты для use-case getUser', () => {
    const sut = new GettingUserService();
    sut.init(resolver);
    afterEach(() => {
      fixtures.resolverGetRepoMock.mockClear();
    });
  
    const user: UserAttrs = 
      {
        userId: 'fa91a299-105b-4fb0-a056-92634249130c',
        telegramId: 5436134100,
        type: 'employee',
        userProfile: {
          firstName: 'Jack',
          lastName: 'Smith',
        },
      }
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
    test('успех, запрос для пользователя нормально проходит', async () => {
      const userRepo = fixtures.resolverGetRepoMock();
      const getUserMock = spyOn(userRepo, 'getUser').mockResolvedValueOnce(success(dtoUtility.deepCopy(user)));
      setAndGetTestStoreDispatcher('pb8a83cf-25a3-2b4f-86e1-2744de6d8374');
      const result = await sut.execute(dtoUtility.deepCopy(validActionDod));
      expect(result.isSuccess()).toBe(true);
      expect(result.value as GetingUserOut).toEqual(user);
      expect(getUserMock).toHaveBeenCalledTimes(1);
      expect(getUserMock.mock.calls[0][0]).toEqual(
        'fa91a299-105b-4fb0-a056-92634249130c'
      );
      getUserMock.mockClear();
    });
    test('провал, запрещен доступ неавторизованному пользователю', async () => {
      setAndGetTestStoreDispatcher('pb8a83cf-25a3-2b4f-86e1-2744de6d8374', {
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
      expect(fixtures.resolverGetRepoMock).toHaveBeenCalledTimes(0);
    });
  
    test('провал, не прошла валидация', async () => {
      fixtures.resolverGetRepoMock();
      setAndGetTestStoreDispatcher('pb8a83cf-25a3-2b4f-86e1-2744de6d8374');
      const notValidInputOpt = {
        ...validActionDod,
        attrs: {userId: 'fa91a299-105b-4fb0-a056-9263429133c'},//not valid
      };
      const result = await sut.execute(notValidInputOpt);
      expect(result.isFailure()).toBe(true);
      expect(result.value).toEqual({
        name: "Validation error",
        meta: {
          domainType: "error",
          errorType: "app-error",
        },
        errors: {
          getUser: {
            userId: [
              {
                text: "Значение должно соответствовать формату UUID",
                hint: {},
                name: "UUIDFormatValidationRule",
              }
            ],
          },
        },
      });
    });
  });
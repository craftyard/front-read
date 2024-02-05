import {
  describe, test, expect, spyOn, afterEach,
} from 'bun:test';
import { dtoUtility } from 'rilata/src/common/utils/dto/dto-utility';
import { setAndGetTestStoreDispatcher } from 'rilata/tests/fixtures/test-thread-store-mock';
import { FindWorkshopByUserIdService } from './service';
import {
  resolver, workshop, inputOptions,
  resolverGetUserWorkshopRepoMock,
} from './fixture';
import { UserAttrs } from 'cy-domain/src/subject/domain-data/user/params';
import { WorkshopReadRepository } from 'cy-domain/src/workshop/domain-object/workshop/repository';
import { UserReadRepository } from 'cy-domain/src/subject/domain-object/user/read-repository';

describe('Тесты для use-case getMyWorkshop', () => {
  const sut = new FindWorkshopByUserIdService();
  sut.init(resolver);
  const workshopRepo = resolverGetUserWorkshopRepoMock(WorkshopReadRepository) as WorkshopReadRepository;
  const getWorkshopMock = spyOn(workshopRepo, 'findWorkshopByUserId');
  afterEach(() => {
    getWorkshopMock.mockClear();
  });
  const users: UserAttrs[] = [
    {
      userId: 'fb8a83cf-25a3-2b4f-86e1-27f6de6d8374',
      telegramId: 5436134100,
      type: 'employee',
      userProfile: {
        firstName: 'Jack',
        lastName: 'Smith',
      },
    },
    {
      userId: '3312a8d6-67ab-4e87-8a21-9d17f508fd5c',
      telegramId: 3290593910,
      type: 'employee',
      userProfile: {
        firstName: 'Bill',
        lastName: 'Oruell',
      },
    },
  ];
  test('успех, запрос для получения workshop-а успешно проходит', async () => {
    getWorkshopMock.mockResolvedValueOnce(dtoUtility.deepCopy(workshop));
    const userRepo = resolverGetUserWorkshopRepoMock(UserReadRepository) as UserReadRepository;
    const getUsersMock = spyOn(userRepo, 'getUsers').mockResolvedValueOnce([...users]);
    setAndGetTestStoreDispatcher('pb8a83cf-25a3-2b4f-86e1-2744de6d8374');
    const result = await sut.execute(inputOptions);
    expect(result.isSuccess()).toBe(true);
    expect(result.value).toEqual({
      workshopId: '6f91d305-3f4b-4a3d-9bef-72cf3757cc33',
      name: 'Nurbolat',
      city: 'Freital',
      address: 'Gerti-Bruns-Weg 4/7 70279 Freital',
      location: { latitude: 88.958285, longitude: 117.84182 },
      employeesRole: { usersAttrs: users },
    });
    expect(getUsersMock).toHaveBeenCalledTimes(1);
    expect(getWorkshopMock).toHaveBeenCalledTimes(1);
    expect(getWorkshopMock.mock.calls[0][0]).toBe('fb8a83cf-25a3-2b4f-86e1-27f6de6d8374');
  });

  test('провал, для текущего пользователя мастерская не найдена', async () => {
    getWorkshopMock.mockResolvedValueOnce(undefined);
    setAndGetTestStoreDispatcher('pb8a83cf-25a3-2b4f-86e1-2744de6d8374');
    const result = await sut.execute(inputOptions);
    expect(result.isFailure()).toBe(true);
    expect(result.value).toEqual({
      locale: {
        text: 'Мастерская не найдена',
        hint: {},
      },
      name: 'WorkshopForUserDoesntExistError',
      meta: {
        domainType: 'error',
        errorType: 'domain-error',
      },
    });
    expect(getWorkshopMock).toHaveBeenCalledTimes(1);
    expect(getWorkshopMock.mock.calls[0][0]).toBe('fb8a83cf-25a3-2b4f-86e1-27f6de6d8374');
  });

  test('провал, запрещен доступ неавторизованному пользователю', async () => {
    setAndGetTestStoreDispatcher('pb8a83cf-25a3-2b4f-86e1-2744de6d8374', {
      type: 'AnonymousUser',
    });
    const result = await sut.execute(inputOptions);
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
    expect(getWorkshopMock).toHaveBeenCalledTimes(0);
  });
});

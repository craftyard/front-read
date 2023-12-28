import {
  describe, test, expect, spyOn, afterEach,
} from 'bun:test';
import { storeDispatcher } from 'rilata/src/app/async-store/store-dispatcher';
import { dtoUtility } from 'rilata/src/common/utils/dto/dto-utility';
import { GetMyWorkshopOut } from 'cy-domain/src/workshop/domain-data/workshop/get-my-workshop/s-params';
import { FindWorkshopByUserIdService } from './service';
import {
  ResolverMock, workshop, domainUserThreadStore, inputOptions, anonymousUserThreadStore,
} from '../fixture';

describe('Тесты для use-case getMyWorkshop', () => {
  const sut = new FindWorkshopByUserIdService();
  const resolver = new ResolverMock();
  sut.init(resolver);

  test('успех, запрос для получения workshop-а успешно проходит', async () => {
    const getWorkshopMock = spyOn(
      resolver.getRepository('repoKey'),
      'findWorkshopByUserId',
    ).mockResolvedValueOnce(dtoUtility.deepCopy(workshop));
    storeDispatcher.setThreadStore(domainUserThreadStore);
    const result = await sut.execute(inputOptions);
    expect(result.isSuccess()).toBe(true);
    expect(result.value as GetMyWorkshopOut).toEqual({
      workshopId: '6f91d305-3f4b-4a3d-9bef-72cf3757cc33',
      name: 'Nurbolat',
      city: 'Freital',
      address: 'Gerti-Bruns-Weg 4/7 70279 Freital',
      location: { latitude: 88.958285, longitude: 117.84182 },
      employeesRole: { userIds: ['fb8a83cf-25a3-2b4f-86e1-27f6de6d8374', '3312a8d6-67ab-4e87-8a21-9d17f508fd5c'] },
    });
    expect(getWorkshopMock).toHaveBeenCalledTimes(1);
    expect(getWorkshopMock.mock.calls[0][0]).toBe('fb8a83cf-25a3-2b4f-86e1-27f6de6d8374');
    afterEach(() => {
      getWorkshopMock.mockClear();
    });
  });

  test('провал, для текущего пользователя мастерская не найдена', async () => {
    const getWorkshopMock = spyOn(
      resolver.getRepository('repoKey'),
      'findWorkshopByUserId',
    ).mockResolvedValueOnce(undefined);
    storeDispatcher.setThreadStore(domainUserThreadStore);
    const result = await sut.execute(inputOptions);
    expect(result.isFailure()).toBe(true);
    expect(result.value).toEqual({
      locale: {
        text: 'Мастерская не найдена',
        hint: {},
      },
      meta: {
        name: 'WorkshopForUserDoesntExistError',
        domainType: 'error',
        errorType: 'domain-error',
      },
    });
    expect(getWorkshopMock).toHaveBeenCalledTimes(1);
    expect(getWorkshopMock.mock.calls[0][0]).toBe('fb8a83cf-25a3-2b4f-86e1-27f6de6d8374');
    afterEach(() => {
      getWorkshopMock.mockClear();
    });
  });

  test('провал, запрещен доступ неавторизованному пользователю', async () => {
    storeDispatcher.setThreadStore(anonymousUserThreadStore);
    const result = await sut.execute(inputOptions);
    expect(result.isFailure()).toBe(true);
    expect(result.value).toEqual({
      locale: {
        text: 'Действие не доступно',
        hint: {
          allowedOnlyFor: ['DomainUser'],
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

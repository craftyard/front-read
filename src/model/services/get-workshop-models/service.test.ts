import {
  afterAll,
  describe, expect, spyOn, test,
} from 'bun:test';
import { setAndGetTestStoreDispatcher } from 'rilata/tests/fixtures/test-thread-store-mock';
import { resolver } from 'rilata/tests/fixtures/test-resolver-mock';
import { ModelServiceFixtures } from '../fixtures';
import { GettingWorkshopModelsService } from './service';

describe('Get workshop models service tests', () => {
  const sut = new GettingWorkshopModelsService();
  sut.init(resolver);

  afterAll(() => {
    ModelServiceFixtures.resolverGetRepoMock.mockClear();
  });

  test('success, client received models by workshop id', async () => {
    const modelRepoMock = ModelServiceFixtures.resolverGetRepoMock();
    const repoGetWorkshopModelsMock = spyOn(modelRepoMock, 'getWorkshopModels').mockResolvedValueOnce(ModelServiceFixtures.workshopModels);
    setAndGetTestStoreDispatcher(ModelServiceFixtures.actionId);
    const result = await sut.execute(ModelServiceFixtures.validActionDod);
    expect(result.isSuccess()).toBe(true);
    expect(result.value).toEqual(ModelServiceFixtures.workshopModels);
    expect(repoGetWorkshopModelsMock).toHaveBeenCalledTimes(1);
    expect(repoGetWorkshopModelsMock.mock.calls[0][0]).toEqual(ModelServiceFixtures.workshopId);
    repoGetWorkshopModelsMock.mockClear();
  });

  test('fail, user didnt log in', async () => {
    setAndGetTestStoreDispatcher(ModelServiceFixtures.actionId, {
      type: 'AnonymousUser',
    });
    const result = await sut.execute(ModelServiceFixtures.validActionDod);
    expect(result.isSuccess()).toBe(false);
    expect(result.value).toEqual({
      locale: {
        hint: {
          allowedOnlyFor: [
            'DomainUser',
          ],
        },
        text: 'Действие не доступно',
      },
      meta: {
        domainType: 'error',
        errorType: 'domain-error',
      },
      name: 'Permission denied',
    });
  });

  test('fail, validation failed', async () => {
    setAndGetTestStoreDispatcher(ModelServiceFixtures.actionId);
    const result = await sut.execute({
      ...ModelServiceFixtures.validActionDod,
      attrs: {
        workshopId: 'f256sd-64fv4sd-ty4df',
      },
    });
    expect(result.isSuccess()).toBe(false);
    expect(result.value).toEqual({
      name: 'Validation error',
      meta: {
        domainType: 'error',
        errorType: 'app-error',
      },
      errors: {
        getWorkshopModels: {
          workshopId: [
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

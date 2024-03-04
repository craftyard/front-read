import {
  afterAll,
  describe, expect, spyOn, test,
} from 'bun:test';
import { setAndGetTestStoreDispatcher } from 'rilata/tests/fixtures/test-thread-store-mock';
import { resolver } from 'rilata/tests/fixtures/test-resolver-mock';
import { GetWorkshopModelsActionDod } from 'cy-domain/src/model/domain-data/model/get-models/s-params';
import { UuidType } from 'rilata/src/common/types';
import { ModelAttrs } from 'cy-domain/src/model/domain-data/params';
import { ModelServiceFixtures } from '../fixtures';
import { GettingWorkshopModelsService } from './service';

describe('Get workshop models service tests', () => {
  const actionId: UuidType = 'pb8a83cf-25a3-2b4f-86e1-2744de6d8374';
  const workshopId: UuidType = 'e59725e7-39ae-48cd-aa10-a0f9a00c0fd9';

  const validActionDod: GetWorkshopModelsActionDod = {
    meta: {
      name: 'getWorkshopModels',
      actionId,
      domainType: 'action',
    },
    attrs: {
      workshopId,
    },
  };
  const workshopModels: ModelAttrs[] = [
    {
      modelId: '0f6df660-80dc-466c-b9f9-d8317f6f47dc',
      workshopId: 'e59725e7-39ae-48cd-aa10-a0f9a00c0fd9',
      name: 'Тубаретка',
      category: 'Мебель',
      images: [],
    },
    {
      modelId: '63f0cc04-5b00-4b4b-a098-37a5d8afe38f',
      workshopId: 'e59725e7-39ae-48cd-aa10-a0f9a00c0fd9',
      name: 'Нож',
      category: 'Кухонная утварь',
      images: [],
    },
    {
      modelId: '6ccb8dc3-90d3-4e8e-b084-b3300c3e8512',
      workshopId: 'e59725e7-39ae-48cd-aa10-a0f9a00c0fd9',
      name: 'Машинка',
      category: 'Игрушки',
      images: [],
    },
  ];
  const sut = new GettingWorkshopModelsService();
  sut.init(resolver);

  afterAll(() => {
    ModelServiceFixtures.resolverGetRepoMock.mockClear();
  });

  test('success, client received models by workshop id', async () => {
    const modelRepoMock = ModelServiceFixtures.resolverGetRepoMock();
    const repoGetWorkshopModelsMock = spyOn(modelRepoMock, 'getWorkshopModels').mockResolvedValueOnce(workshopModels);
    setAndGetTestStoreDispatcher(actionId);
    const result = await sut.execute(validActionDod);
    expect(result.isSuccess()).toBe(true);
    expect(result.value).toEqual(workshopModels);
    expect(repoGetWorkshopModelsMock).toHaveBeenCalledTimes(1);
    expect(repoGetWorkshopModelsMock.mock.calls[0][0]).toEqual(workshopId);
    repoGetWorkshopModelsMock.mockClear();
  });
});

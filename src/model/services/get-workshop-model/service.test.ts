import {
  afterAll,
  describe, expect, spyOn, test,
} from 'bun:test';
import { setAndGetTestStoreDispatcher } from 'rilata/tests/fixtures/test-thread-store-mock';
import { resolver } from 'rilata/tests/fixtures/test-resolver-mock';
import { UuidType } from 'rilata/src/common/types';
import { GetWorkshopModelActionDod } from 'cy-domain/src/model/domain-data/model/get-model/s-params';
import { ModelAttrs } from 'cy-domain/src/model/domain-data/params';
import { ModelServiceFixtures } from '../fixtures';
import { GettingWorkshopModelService } from './service';

describe('Get workshop models service tests', () => {
  const actionId: UuidType = 'pb8a83cf-25a3-2b4f-86e1-2744de6d8374';
  const workshopId: UuidType = 'e59725e7-39ae-48cd-aa10-a0f9a00c0fd9';
  const modelId: UuidType = '0f6df660-80dc-466c-b9f9-d8317f6f47dc';
  const workshopModel: ModelAttrs = {
    modelId: '0f6df660-80dc-466c-b9f9-d8317f6f47dc',
    workshopId: 'e59725e7-39ae-48cd-aa10-a0f9a00c0fd9',
    name: 'Тубаретка',
    category: 'Мебель',
    images: [],
  };
  const validActionDod: GetWorkshopModelActionDod = {
    meta: {
      name: 'getWorkshopModel',
      actionId,
      domainType: 'action',
    },
    attrs: {
      workshopId,
      modelId,
    },
  };
  const sut = new GettingWorkshopModelService();
  sut.init(resolver);

  afterAll(() => {
    ModelServiceFixtures.resolverGetRepoMock.mockClear();
  });

  test('should return workshopModel when client receives model by workshop id', async () => {
    const modelRepoMock = ModelServiceFixtures.resolverGetRepoMock();
    const repoGetWorkshopModelsMock = spyOn(modelRepoMock, 'getWorkshopModel').mockResolvedValueOnce(workshopModel);
    setAndGetTestStoreDispatcher(actionId);
    const result = await sut.execute(validActionDod);
    expect(result.isSuccess()).toBe(true);
    expect(result.value).toEqual(workshopModel);
    expect(repoGetWorkshopModelsMock).toHaveBeenCalledTimes(1);
    expect(repoGetWorkshopModelsMock.mock.calls[0][0]).toEqual(workshopId);
    repoGetWorkshopModelsMock.mockClear();
  });

  test('should return undefined when client receives no model by workshop id', async () => {
    const modelRepoMock = ModelServiceFixtures.resolverGetRepoMock();
    const repoGetWorkshopModelsMock = spyOn(modelRepoMock, 'getWorkshopModel').mockResolvedValueOnce(undefined);
    setAndGetTestStoreDispatcher(actionId);
    const result = await sut.execute(validActionDod);
    expect(result.isSuccess()).toBe(true);
    expect(result.value).toBeUndefined();
    expect(repoGetWorkshopModelsMock).toHaveBeenCalledTimes(1);
    expect(repoGetWorkshopModelsMock.mock.calls[0][0]).toEqual(workshopId);
    repoGetWorkshopModelsMock.mockClear();
  });
});

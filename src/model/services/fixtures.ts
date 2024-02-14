import { Mock, spyOn } from 'bun:test';
import { GetWorkshopModelsActionDod } from 'cy-domain/src/model/domain-data/model/get-models/s-params';
import { ModelAttrs } from 'cy-domain/src/model/domain-data/params';
import { ModelReadRepository } from 'cy-domain/src/model/domain-object/model/read-repository';
import { UuidType } from 'rilata/src/common/types';
import { resolver } from 'rilata/tests/fixtures/test-resolver-mock';

export namespace ModelServiceFixtures {
    export class ModelReadRepositoryMock implements ModelReadRepository {
      getWorkshopModels(workshopId: string): Promise<ModelAttrs[]> {
        throw new Error('Method not implemented.');
      }
    }

    export const actionId: UuidType = 'pb8a83cf-25a3-2b4f-86e1-2744de6d8374';
    export const workshopId: UuidType = 'e59725e7-39ae-48cd-aa10-a0f9a00c0fd9';

    export const validActionDod: GetWorkshopModelsActionDod = {
      meta: {
        name: 'getWorkshopModels',
        actionId,
        domainType: 'action',
      },
      attrs: {
        workshopId,
      },
    };

    export const resolverGetRepoMock = spyOn(
      resolver,
      'getRepository',
    ).mockReturnValue(
      new ModelReadRepositoryMock(),
    )as Mock<(...args: unknown[]) => ModelReadRepositoryMock>;

    export const workshopModels: ModelAttrs[] = [
      {
        modelId: '0f6df660-80dc-466c-b9f9-d8317f6f47dc',
        workshopId: 'e59725e7-39ae-48cd-aa10-a0f9a00c0fd9',
        name: 'Тубаретка',
        category: 'Мебель',
      },
      {
        modelId: '63f0cc04-5b00-4b4b-a098-37a5d8afe38f',
        workshopId: 'e59725e7-39ae-48cd-aa10-a0f9a00c0fd9',
        name: 'Нож',
        category: 'Кухонная утварь',
      },
      {
        modelId: '6ccb8dc3-90d3-4e8e-b084-b3300c3e8512',
        workshopId: 'e59725e7-39ae-48cd-aa10-a0f9a00c0fd9',
        name: 'Машинка',
        category: 'Игрушки',
      },
    ];
}

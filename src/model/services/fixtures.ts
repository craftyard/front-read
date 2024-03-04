/* eslint-disable @typescript-eslint/no-unused-vars */
import { Mock, spyOn } from 'bun:test';
import { ModelAttrs } from 'cy-domain/src/model/domain-data/params';
import { ModelReadRepository } from 'cy-domain/src/model/domain-object/model/read-repository';
import { resolver } from 'rilata/tests/fixtures/test-resolver-mock';

export namespace ModelServiceFixtures {
    export class ModelReadRepositoryMock implements ModelReadRepository {
      getWorkshopModel(workshopId: string, modelId: string): Promise<ModelAttrs> {
        throw new Error('Method not implemented.');
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      getWorkshopModel(workshopId: string, modelId: string): Promise<ModelAttrs> {
        throw new Error('Method not implemented.');
      }

      getWorkshopModels(workshopId: string): Promise<ModelAttrs[]> {
        throw new Error('Method not implemented.');
      }
    }

    export const resolverGetRepoMock = spyOn(
      resolver,
      'getRepository',
    ).mockReturnValue(
      new ModelReadRepositoryMock(),
    )as Mock<(...args: unknown[]) => ModelReadRepositoryMock>;
}

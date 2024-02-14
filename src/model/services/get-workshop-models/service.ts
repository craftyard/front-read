import { GetWorkshopModelsActionDod, GetingWorkshopModelsServiceParams } from 'cy-domain/src/model/domain-data/model/get-models/s-params';
import { getingWorkshopModelsValidator } from 'cy-domain/src/model/domain-data/model/get-models/v-map';
import { ModelReadRepository } from 'cy-domain/src/model/domain-object/model/read-repository';
import { QueryService } from 'rilata/src/app/service/query-service';
import { ServiceResult } from 'rilata/src/app/service/types';
import { success } from 'rilata/src/common/result/success';

export class GettingWorkshopModelsService extends QueryService<GetingWorkshopModelsServiceParams> {
  protected name = 'getWorkshopModels' as const;

  protected aRootName = 'ModelAR' as const;

  protected supportedCallers: readonly ('ModuleCaller' | 'AnonymousUser' | 'DomainUser')[] = ['DomainUser'];

  protected async runDomain(
    actionDod: GetWorkshopModelsActionDod,
  ): Promise<ServiceResult<GetingWorkshopModelsServiceParams>> {
    const repo = ModelReadRepository.instance(this.moduleResolver);
    return success(await repo.getWorkshopModels(actionDod.attrs.workshopId));
  }

  protected validatorMap = getingWorkshopModelsValidator;
}

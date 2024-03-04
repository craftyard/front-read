import { GetWorkshopModelActionDod, GettingWorkshopModelServiceParams } from 'cy-domain/src/model/domain-data/model/get-model/s-params';
import { gettingWorkshopModelValidator } from 'cy-domain/src/model/domain-data/model/get-model/v-map';
import { ModelReadRepository } from 'cy-domain/src/model/domain-object/model/read-repository';
import { QueryService } from 'rilata/src/app/service/query-service';
import { ServiceResult } from 'rilata/src/app/service/types';
import { success } from 'rilata/src/common/result/success';

export class GettingWorkshopModelService extends QueryService<GettingWorkshopModelServiceParams> {
  protected name = 'getWorkshopModel' as const;

  protected aRootName = 'ModelAR' as const;

  protected supportedCallers: readonly ('ModuleCaller' | 'AnonymousUser' | 'DomainUser')[] = ['DomainUser'];

  protected async runDomain(
    actionDod: GetWorkshopModelActionDod,
  ): Promise<ServiceResult<GettingWorkshopModelServiceParams>> {
    const repo = ModelReadRepository.instance(this.moduleResolver);
    const repoResult = await repo
      .getWorkshopModel(actionDod.attrs.workshopId, actionDod.attrs.modelId);
    if (repoResult.isSuccess()) {
      success(repoResult.value);
    }
    return repoResult;
  }

  protected validatorMap = gettingWorkshopModelValidator;
}

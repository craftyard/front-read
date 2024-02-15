import { QueryService } from "rilata/src/app/service/query-service";
import { ServiceResult } from "rilata/src/app/service/types";
import { GettingWorkshopModelServiceParams, GetWorkshopModelActionDod } from "cy-domain/src/model/domain-data/model/get-model/s-params";
import { gettingWorkshopModelValidator } from 'cy-domain/src/model/domain-data/model/get-model/v-map';
import { ModelReadRepository } from 'cy-domain/src/model/domain-object/model/read-repository';

export class GettingWorkshopModelService extends QueryService<GettingWorkshopModelServiceParams> {
    protected aRootName: "ModelAR" = 'ModelAR';

    protected name: "getWorkshopModel" = 'getWorkshopModel';

    protected supportedCallers: readonly ("ModuleCaller" | "AnonymousUser" | "DomainUser")[] = ['DomainUser'];

    protected validatorMap = gettingWorkshopModelValidator;
    
    protected async runDomain(actionDod: GetWorkshopModelActionDod): Promise<ServiceResult<GettingWorkshopModelServiceParams>> {
        const repo = ModelReadRepository.instance(this.moduleResolver);
        return repo.getWorkshopModel(actionDod.attrs.workshopId, actionDod.attrs.modelId);
    }
}

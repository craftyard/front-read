import { QueryService } from 'rilata/src/app/service/query-service';
import { ActionDodValidator, ServiceResult } from 'rilata/src/app/service/types';
import { GetUserActionDod, GetingUserServiceParams } from 'cy-domain/src/subject/domain-data/user/get-user/s-params';
import { UserReadRepository } from 'cy-domain/src/subject/domain-object/user/read-repository';
import { getUserValidator } from 'cy-domain/src/subject/domain-data/user/get-user/v-map';

export class GettingUserService extends QueryService<GetingUserServiceParams> {
  protected aRootName: 'UserAR' = 'UserAR' as const;

  protected name: 'getUser' = 'getUser' as const;

  protected supportedCallers: readonly ('ModuleCaller' | 'AnonymousUser' | 'DomainUser')[] = ['DomainUser'];

  protected validatorMap: ActionDodValidator<GetingUserServiceParams> = getUserValidator;

  protected async runDomain(
    actionDod: GetUserActionDod,
  ): Promise<ServiceResult<GetingUserServiceParams>> {
    const repo = UserReadRepository.instance(this.moduleResolver);
    return repo.getUser(actionDod.attrs.userId);
  }
}

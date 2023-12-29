import { QueryService } from 'rilata/src/app/service/query-service';
import { ActionDodValidator, ServiceResult } from 'rilata/src/app/service/types';
import { GetUsersActionDod, GetingUsersServiceParams } from 'cy-domain/src/subject/domain-data/user/get-users/s-params';
import { UserReadRepository } from 'cy-domain/src/subject/domain-object/user/read-repository';
import { getUsersValidator } from 'cy-domain/src/subject/domain-data/user/get-users/v-map';
import { success } from 'rilata/src/common/result/success';

export class GettingUserService extends QueryService<GetingUsersServiceParams> {
  protected aRootName: 'UserAR';

  protected name: 'getUsers' = 'getUsers' as const;

  protected supportedCallers: readonly ('ModuleCaller' | 'AnonymousUser' | 'DomainUser')[] = ['DomainUser'];

  protected validatorMap: ActionDodValidator<GetingUsersServiceParams> = getUsersValidator;

  protected async runDomain(
    actionDod: GetUsersActionDod,
  ): Promise<ServiceResult<GetingUsersServiceParams>> {
    const repo = UserReadRepository.instance(this.moduleResolver);
    return success(await repo.getUsers(actionDod.attrs.userIds));
  }
}

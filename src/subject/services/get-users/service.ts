import { QueryUseCase } from 'rilata/src/app/use-case/query-use-case';
import { ActionDodValidator, GetUcResult } from 'rilata/src/app/use-case/types';
import { GetUsersInputOptions, GetingUsersUcParams } from 'cy-domain/src/subject/domain-data/user/get-users/s-params';
import { UserRepository } from 'cy-domain/src/subject/domain-object/user/repository';
import { getUsersValidator } from 'cy-domain/src/subject/domain-data/user/get-users/v-map';
import { success } from 'rilata/src/common/result/success';

export class GettingUserUC extends QueryUseCase<GetingUsersUcParams> {
  protected aRootName: 'UserAR';

  protected name: 'getUsers' = 'getUsers' as const;

  protected supportedCallers: readonly ('ModuleCaller' | 'AnonymousUser' | 'DomainUser')[] = ['DomainUser'];

  protected validatorMap: ActionDodValidator<GetingUsersUcParams> = getUsersValidator;

  protected async runDomain(
    options: GetUsersInputOptions,
  ): Promise<GetUcResult<GetingUsersUcParams>> {
    const repo = UserRepository.instance(this.moduleResolver);
    return success(await repo.getUsers(options.actionDod.body.userIds));
  }
}

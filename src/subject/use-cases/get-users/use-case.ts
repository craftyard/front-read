import { QueryUseCase } from 'rilata2/src/app/use-case/query-use-case';
import { ActionDodValidator, GetUcResult } from 'rilata2/src/app/use-case/types';
import { GetUsersInputOptions, GetingUsersUcParams } from 'workshop-domain/src/subject/domain-data/user/get-users/uc-params';
import { getUsersValidator } from 'workshop-domain/src/subject/domain-data/user/get-users/v-map';

export class GettingUserUC extends QueryUseCase<GetingUsersUcParams> {
  protected name: 'getUsers' = 'getUsers' as const;

  protected supportedCallers: readonly ('ModuleCaller' | 'AnonymousUser' | 'DomainUser')[] = ['DomainUser'];

  protected validatorMap: ActionDodValidator<GetingUsersUcParams> = getUsersValidator;

  protected aggregateName = 'UserAR';

  protected runDomain(options: GetUsersInputOptions): Promise<GetUcResult<GetingUsersUcParams>> {
    console.log('runned')
  }
}

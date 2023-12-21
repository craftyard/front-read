import { QueryUseCase } from 'rilata2/src/app/use-case/query-use-case';
import { UcResult } from 'rilata2/src/app/use-case/types';
import { TokenCreator } from 'rilata2/src/app/jwt/token-creator.interface';
import { UserAuthentificationInputOptions, UserAuthentificationUCParams } from 'workshop-domain/src/subject/domain-data/user/user-authentification/uc-params';
import { userAuthentificationValidator } from 'workshop-domain/src/subject/domain-data/user/user-authentification/v-map';
import { UserRepository } from 'workshop-domain/src/subject/domain-object/user/repository';
import { UserFactory } from 'workshop-domain/src/subject/domain-object/user/factory';
import { AuthentificationUserDomainQuery } from 'workshop-domain/src/subject/domain-data/user/user-authentification/a-params';

export class UserAuthentificationUC extends QueryUseCase<UserAuthentificationUCParams> {
  protected name: 'userAuthentification' = 'userAuthentification' as const;

  protected aRootName: 'UserAR' = 'UserAR' as const;

  protected supportedCallers: readonly ('ModuleCaller' | 'AnonymousUser' | 'DomainUser')[] = ['AnonymousUser'];

  protected validatorMap = userAuthentificationValidator;

  protected async runDomain(
    options: UserAuthentificationInputOptions,
  ): Promise<UcResult<UserAuthentificationUCParams>> {
    const userRepo = UserRepository.instance(this.moduleResolver);
    const telegramId = options.actionDod.body.id;
    const userAttrs = await userRepo.findByTelegramId(telegramId);
    const userAr = new UserFactory(this.logger).create(options.caller, userAttrs[0]);

    const userAuthQueryCommand: AuthentificationUserDomainQuery = {
      botToken: this.moduleResolver.getRealisation('botToken') as string,
      telegramAuthDTO: options.actionDod.body,
    };
    const tokenCreator = TokenCreator.instance(this.moduleResolver);
    return userAr.userAuthentification(userAuthQueryCommand, tokenCreator);
  }
}

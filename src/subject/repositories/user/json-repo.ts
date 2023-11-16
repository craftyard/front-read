import { Logger } from 'rilata2/src/common/logger/logger';
import { UserAttrs } from 'workshop-domain/src/subject/domain-data/user/params';
import { userAttrsVMap } from 'workshop-domain/src/subject/domain-data/user/v-map';
import { UserRepository } from 'workshop-domain/src/subject/domain-object/user/repository';

export class UserJsonRepository implements UserRepository {
  private users: UserAttrs[];

  constructor(jsonUsers: string, logger: Logger) {
    this.users = JSON.parse(jsonUsers);
    const userAttrsKeys: (keyof UserAttrs)[] = [
      'userId', 'telegramId', 'employeeId', 'userProfile',
    ];
    userAttrsKeys.forEach((key) => {
      this.users.forEach((user) => {
        const validateResult = userAttrsVMap[key].validate(user[key]);
        if (validateResult.isFailure()) logger.error('Входящие данные не валидны', validateResult.value);
      });
    });
  }

  findByTelegramId(telegramId: number): UserAttrs[] {
    return this.users.filter((user) => user.telegramId === telegramId);
  }
}

import { DtoFieldValidator } from 'rilata2/src/domain/validator/field-validator/dto-field-validator';
import { ValidatorMap } from 'rilata2/src/domain/validator/field-validator/types';
import { LiteralFieldValidator } from 'rilata2/src/domain/validator/field-validator/literal-field-validator';
import { PositiveNumberValidationRule } from 'rilata2/src/domain/validator/rules/validate-rules/number/positive-number.v-rule';
import { EqualCharsCountValidationRule } from 'rilata2/src/domain/validator/rules/validate-rules/string/equal-chars-count.v-rule';
import { NoContainedCharsValidationRule } from 'rilata2/src/domain/validator/rules/validate-rules/string/no-contained-chars..v-rule';
import { TelegramAuthDTO } from '../../domain-data/user/user-authentification.a-params';

const telegramAuthAttrsValidatorMap: ValidatorMap<TelegramAuthDTO> = {
  id: new LiteralFieldValidator('id', false, { isArray: false }, 'number', [new PositiveNumberValidationRule()]),
  first_name: new LiteralFieldValidator('first_name', false, { isArray: false }, 'string', []),
  last_name: new LiteralFieldValidator('last_name', false, { isArray: false }, 'string', []),
  username: new LiteralFieldValidator('username', false, { isArray: false }, 'string', []),
  photo_url: new LiteralFieldValidator('photo_url', false, { isArray: false }, 'string', []),
  auth_date: new LiteralFieldValidator('auth_date', true, { isArray: false }, 'string', [new NoContainedCharsValidationRule('#!&?-')]),
  hash: new LiteralFieldValidator('hash', true, { isArray: false }, 'string', [new EqualCharsCountValidationRule(64)]),
};

export class TelegramAuthDTOValidator extends DtoFieldValidator<'TelegramAuthDTO', true, false, TelegramAuthDTO> {
  constructor() {
    super('TelegramAuthDTO', true, { isArray: false }, 'dto', telegramAuthAttrsValidatorMap);
  }
}

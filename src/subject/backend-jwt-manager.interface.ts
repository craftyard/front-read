import { Realisable } from 'rilata2/src/domain/realisable';
import { JWTManager } from 'rilata2/src/app/jwt/jwt-manager.interface';
import { DTO } from 'rilata2/src/domain/dto';
import { TokenCreator } from 'workshop-domain/src/subject/token-creator.interface';
import { TokenVerifier } from './token-verifier.interface';

export interface BackendJWTManager<PAYLOAD extends DTO>
extends JWTManager<PAYLOAD>, TokenVerifier<PAYLOAD>, TokenCreator {
  /**
   * Проверить и получить полезные данные jwt
   * @param rawToken токен для проверки
   * @param tokenType тип токена
   * @returns Result
   *   - success:
   *     - - PAYLOAD полезные данные jwt
   *   - failure:
   *     - - IncorrectTokenType - если указанные tokenType не совпадает с тем что в токене
   *     - - NotValidTokenPayload - если не валидные полезные данные
   *     - - TokenExpiredError - токен просрочен
   *     - - NotBeforeError - время работы токена ещё не наступило
   *     - - JsonWebTokenError - иная ошибка
   */
}

export const BackendJWTManager = {
  instance(resolver: Realisable): BackendJWTManager<unknown> {
    return resolver.getRealisatioin(BackendJWTManager) as BackendJWTManager<unknown>;
  },
};

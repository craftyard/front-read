import { VerifyTokenError } from 'rilata2/src/app/jwt/errors';
import { Result } from 'rilata2/src/common/result/types';
import { DTO } from 'rilata2/src/domain/dto';
import { TokenType } from './infra/jwt/types';

export interface TokenVerifier<PAYLOAD extends DTO> {
  verifyToken(rawToken: string, tokenType: TokenType): Result<VerifyTokenError, PAYLOAD>
}

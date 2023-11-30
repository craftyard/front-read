import { Realisable } from 'rilata2/src/domain/realisable';
import { JWTManager } from 'rilata2/src/app/jwt/jwt-manager.interface';
import { DTO } from 'rilata2/src/domain/dto';
import { TokenCreator } from 'workshop-domain/src/subject/token-creator.interface';
import { TokenVerifier } from './token-verifier.interface';

export interface BackendJWTManager<PAYLOAD extends DTO>
extends JWTManager<PAYLOAD>, TokenVerifier<PAYLOAD>, TokenCreator {}

export const BackendJWTManager = {
  instance(resolver: Realisable): BackendJWTManager<unknown> {
    return resolver.getRealisatioin(BackendJWTManager) as BackendJWTManager<unknown>;
  },
};

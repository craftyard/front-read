import { Injectable } from '@nestjs/common';
import { GeneraQuerylUseCase, GeneralCommandUseCase } from 'rilata/src/app/use-case/types';
import { SubjectDomainModule } from 'cy-domain/src/subject/module';
import { GettingUserUC } from './use-cases/get-users/use-case';

@Injectable()
export class SubjectModule extends SubjectDomainModule {
  queryUseCases: GeneraQuerylUseCase[] = [
    new GettingUserUC(),
  ];

  commandUseCases: GeneralCommandUseCase[] = [];
}

import { Injectable } from '@nestjs/common';
import { GeneraQuerylUseCase, GeneralCommandUseCase } from 'rilata2/src/app/use-case/types';
import { WorkshopDomainModule } from 'workshop-domain/src/workshop/module';

@Injectable()
export class WorkshopModule extends WorkshopDomainModule {
  queryUseCases: GeneraQuerylUseCase[] = [];

  commandUseCases: GeneralCommandUseCase[] = [];
}

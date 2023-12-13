import { Failure } from 'rilata2/src/common/result/failure';
import { InferFailure, InferSuccess, Result } from 'rilata2/src/common/result/types';

export type UseCaseOut<
  F extends GeneralDomainErrorDOD | GeneralAppErrorDOD,
  S,
> = Result<F | CommonUseCaseOutFailures, S>;
export type GeneralUseCaseOut = UseCaseOut<GeneralDomainErrorDOD | GeneralAppErrorDOD, unknown>;
export const validationErrorName = 'ValidationError';
export const callerPermissionErrorName = 'CallerPermissionError';
export const internalErrorName = 'InternalError';

class ControllerUtility {
  defineUseCaseFailureResultHTTPStatus(
    useCaseOut: Failure<InferFailure<GeneralUseCaseOut>, InferSuccess<GeneralUseCaseOut>>,
  ): number {
    if (useCaseOut.value.meta.name === validationErrorName) {
      return 409; // conflict
    }

    if (useCaseOut.value.meta.name === callerPermissionErrorName) {
      return 403; // forbidden
    }

    if (useCaseOut.value.meta.name === internalErrorName) {
      return 500; // server error
    }

    if (
      useCaseOut.value.meta.errorType === 'domain-error'
      || useCaseOut.value.meta.errorType === 'app-error'
    ) {
      return 400; // bad request
    }

    // TODO: залоггировать
    return 500;
  }

  convertToResultDTO<UCOUT extends GeneralUseCaseOut>(
    useCaseOut: UCOUT,
  ): ResultDTOFromUCOut<UCOUT> {
    return {
      status: useCaseOut.isSuccess(),
      payload: useCaseOut.value as ResultDTOPayloadFromUCOut<UCOUT>,
    };
  }
}

export const controllerUtility = Object.freeze(new ControllerUtility());

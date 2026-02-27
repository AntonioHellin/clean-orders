export type AppErrorType =
    | 'VALIDATION_ERROR'
    | 'NOT_FOUND_ERROR'
    | 'CONFLICT_ERROR'
    | 'INFRA_ERROR'
    | 'DOMAIN_ERROR';

export interface BaseAppError {
    type: AppErrorType;
    message: string;
    details?: any;
}

export interface ValidationError extends BaseAppError {
    type: 'VALIDATION_ERROR';
}

export interface NotFoundError extends BaseAppError {
    type: 'NOT_FOUND_ERROR';
}

export interface ConflictError extends BaseAppError {
    type: 'CONFLICT_ERROR';
}

export interface InfraError extends BaseAppError {
    type: 'INFRA_ERROR';
}

export interface DomainErrorWrapper extends BaseAppError {
    type: 'DOMAIN_ERROR';
}

export type AppError =
    | ValidationError
    | NotFoundError
    | ConflictError
    | InfraError
    | DomainErrorWrapper;

export const createValidationError = (message: string, details?: any): ValidationError => ({
    type: 'VALIDATION_ERROR',
    message,
    details
});

export const createNotFoundError = (message: string, details?: any): NotFoundError => ({
    type: 'NOT_FOUND_ERROR',
    message,
    details
});

export const createConflictError = (message: string, details?: any): ConflictError => ({
    type: 'CONFLICT_ERROR',
    message,
    details
});

export const createInfraError = (message: string, details?: any): InfraError => ({
    type: 'INFRA_ERROR',
    message,
    details
});

export const createDomainError = (message: string, details?: any): DomainErrorWrapper => ({
    type: 'DOMAIN_ERROR',
    message,
    details
});

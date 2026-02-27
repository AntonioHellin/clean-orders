export type Success<T> = {
    isSuccess: true;
    isFailure: false;
    value: T;
};

export type Failure<E> = {
    isSuccess: false;
    isFailure: true;
    error: E;
};

export type Result<T, E> = Success<T> | Failure<E>;

export const ok = <T, E = never>(value: T): Result<T, E> => {
    return {
        isSuccess: true,
        isFailure: false,
        value,
    };
};

export const fail = <T = never, E = Error>(error: E): Result<T, E> => {
    return {
        isSuccess: false,
        isFailure: true,
        error,
    };
};

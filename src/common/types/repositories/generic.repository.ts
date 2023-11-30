export type GenericStatmentReturn<T extends Record<string, unknown>> =
  | Promise<T[] | T>
  | ((...args: unknown[]) => Promise<T[] | T> | void)
  | void;

export abstract class GenericStatmentRepository<
  T extends Record<string, unknown>,
> {
  abstract getAll(): GenericStatmentReturn<T>;

  abstract get(id: string, ...args: unknown[]): GenericStatmentReturn<T>;

  abstract create(data: T): void;

  abstract update(id: string, data: T): GenericStatmentReturn<T>;

  abstract delete(id: string, data?: T): GenericStatmentReturn<T>;
}

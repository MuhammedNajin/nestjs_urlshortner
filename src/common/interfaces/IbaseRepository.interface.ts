
export interface IBaseRepository<T> {
    create(entity: T): Promise<T>;
    findById?(id: string): Promise<T | null>;
    findOne?(query: any): Promise<T | null>;
    find?(query: any): Promise<T[]>;
  }
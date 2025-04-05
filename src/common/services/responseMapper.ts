import { Injectable } from '@nestjs/common';
import { ApiResponse } from '../interfaces/generics.type';

@Injectable()
export class ResponseMapper {
  success<T>({ data, message }: { data: T; message: string }): ApiResponse<T> {
    return {
      status: 'success',
      data,
      message,
    };
  }

  error(message: string): ApiResponse<null> {
    return {
      status: 'error',
      data: null,
      message,
    };
  }
}

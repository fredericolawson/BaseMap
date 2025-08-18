import { LoadingState } from '../constants/fieldTypes';

export type ApiResponse<T> = {
  data: T | null;
  error: string | null;
  status: LoadingState;
};

export type AsyncResult<T> = Promise<ApiResponse<T>>;

export interface ErrorResponse {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}
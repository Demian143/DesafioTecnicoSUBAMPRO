import axios from "axios";

export class ApiError extends Error {
  readonly status?: number;
  readonly code?: string;
  readonly details?: unknown;

  constructor(message: string, options: { status?: number; code?: string; details?: unknown } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = options.status;
    this.code = options.code;
    this.details = options.details;
  }
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  if (!axios.isAxiosError(error)) return new ApiError("An unexpected error occurred", { details: error });

  const body = error.response?.data as
    | { message?: string; errors?: Record<string, string[]> }
    | undefined;
  const validationMessage = body?.errors ? Object.values(body.errors).flat()[0] : undefined;

  return new ApiError(validationMessage ?? body?.message ?? error.message, {
    status: error.response?.status,
    code: error.code,
    details: body?.errors ?? body,
  });
}

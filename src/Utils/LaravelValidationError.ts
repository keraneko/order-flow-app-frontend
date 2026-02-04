export interface LaravelValidationError {
  message?: string;
  errors?: Record<string, string[]>;
}

export async function getFirstValidationMessage(
  res: Response,
  fallback = '入力内容を確認してください',
): Promise<string> {
  try {
    const err = (await res.json()) as LaravelValidationError;
    const firstArray = Object.values(err.errors ?? {})[0];

    return firstArray?.[0] ?? err.message ?? fallback;
  } catch {
    return fallback;
  }
}

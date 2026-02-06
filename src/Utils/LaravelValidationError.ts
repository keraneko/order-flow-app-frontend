export interface LaravelValidationError {
  message?: string;
  errors?: Record<string, string[]>;
}

export async function getFirstValidationMessage(
  res: Response,
  fallback = '入力内容を確認してください',
  preferField?: string,
): Promise<string> {
  try {
    const err = (await res.json()) as LaravelValidationError;
    const errors = err.errors ?? {};

    const pickFrom = (arr?: string[]) => {
      if (!arr?.length) return undefined;
      const digits = arr.find(
        (m) => m.includes('digits') || m.includes('validation.digits'),
      );

      return digits ?? arr[0];
    };

    if (preferField && errors[preferField]) {
      return pickFrom(errors[preferField]) ?? err.message ?? fallback;
    }

    const firstArray = Object.values(errors)[0];

    return pickFrom(firstArray) ?? err.message ?? fallback;
  } catch {
    return fallback;
  }
}

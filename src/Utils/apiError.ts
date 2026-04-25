function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function getFirstAxiosValidationMessage(
  data: unknown,
): string | undefined {
  if (!isRecord(data)) return;

  const errors = data.errors;

  if (!isRecord(errors)) return;

  for (const value of Object.values(errors)) {
    if (Array.isArray(value) && typeof value[0] === 'string') {
      return value[0];
    }
  }

  return;
}

export function getAxiosMessage(data: unknown): string | undefined {
  if (!isRecord(data)) return;

  const message = data.message;

  if (typeof message !== 'string') return;

  return message;
}

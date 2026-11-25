export type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const deepEqual = (first: unknown, second: unknown): boolean => {
  if (!isObject(first) || !isObject(second)) return first === second;

  const keys = Object.keys(first);

  return (
    keys.length === Object.keys(second).length &&
    keys.every((key) => key in second && deepEqual(first[key], second[key]))
  );
};

export const deepMerge = <T>(base: T, patch: DeepPartial<T>): T => {
  if (!isObject(base) || !isObject(patch)) return base;

  const result: Record<string, unknown> = { ...base };

  for (const [key, value] of Object.entries(patch)) {
    const current = result[key];
    result[key] =
      isObject(current) && isObject(value)
        ? deepMerge(current, value as DeepPartial<typeof current>)
        : value;
  }

  return result as T;
};

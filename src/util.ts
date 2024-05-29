export function pick<T extends object, U extends keyof T>(
  base: Readonly<T>,
  keys: Readonly<U[]>,
): Pick<T, U> {
  const result = {} as Pick<T, U>;
  for (const key of keys) {
    result[key] = base[key];
  }
  return result;
}

export function omit<T extends object, U extends keyof T>(
  base: Readonly<T>,
  keys: Readonly<U[]>,
): Omit<T, U> {
  const result = { ...base };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}

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

export function jsonReplacer(_key: string, value: unknown): unknown {
  if (value instanceof Set) {
    return `Set<${Array.from(value)}>`;
  }

  if (value instanceof Map) {
    return `Map<${Object.fromEntries(value)}>`;
  }

  return value;
}

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

// TODO: Use built-in Map.groupBy() since using nodejs v21+ in the action engine
export function groupBy<T, K>(items: ReadonlyArray<T>, callback: (item: T) => K): Map<K, Array<T>> {
  const map = new Map<K, Array<T>>();
  for (const item of items) {
    const key = callback(item);
    // Do not omit has() with get(), `undefined` might be a key
    if (map.has(key)) {
      const itemsForKey = map.get(key);
      if (itemsForKey) {
        itemsForKey.push(item);
      }
    } else {
      map.set(key, [item]);
    }
  }
  return map;
}

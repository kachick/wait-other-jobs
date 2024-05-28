// https://stackoverflow.com/a/56162151
export function pick<T extends object, U extends keyof T>(
  obj: T,
  paths: Array<U>,
): Pick<T, U> {
  const ret = Object.create({});
  for (const k of paths) {
    ret[k] = obj[k];
  }
  return ret;
}

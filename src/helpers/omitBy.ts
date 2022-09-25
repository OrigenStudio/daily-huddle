interface AnyObject {
  [key: string]: any;
}

export default function omitBy<T extends AnyObject>(
  obj: T,
  predicate: <K extends keyof T>(value: T[K], key: K) => boolean
): Partial<T> {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    return predicate(value as T[keyof T], key as keyof T)
      ? acc
      : { ...acc, [key]: value };
  }, {});
}

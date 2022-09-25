const isArray = Array.isArray;
const keyList = Object.keys;
const hasProp = Object.prototype.hasOwnProperty;

/**
 * Deep comparison of two values.
 *
 * @see https://gist.github.com/jsdevtom/36ba2ddaab5e612188ec09daca750371
 */
export default function isDeeplyEqual<T>(a: T, b: T): boolean {
  if (a === b) {
    return true;
  }

  if (a && b && typeof a === "object" && typeof b === "object") {
    const arrA = isArray(a),
      arrB = isArray(b);
    let i, length, key;

    if (arrA && arrB) {
      length = a.length;
      if (length !== b.length) {
        return false;
      }
      for (i = length; i-- !== 0; ) {
        if (!isDeeplyEqual(a[i], b[i])) {
          return false;
        }
      }
      return true;
    }

    if (arrA !== arrB) {
      return false;
    }

    const dateA = a instanceof Date,
      dateB = b instanceof Date;
    if (dateA !== dateB) {
      return false;
    }
    if (dateA && dateB) {
      return a.getTime() === b.getTime();
    }

    const regexpA = a instanceof RegExp,
      regexpB = b instanceof RegExp;
    if (regexpA !== regexpB) {
      return false;
    }
    if (regexpA && regexpB) {
      return a.toString() === b.toString();
    }

    const keys = keyList(a);
    length = keys.length;

    if (length !== keyList(b).length) {
      return false;
    }

    for (i = length; i-- !== 0; ) {
      // @ts-expect-error: undefined as key
      if (!hasProp.call(b, keys[i])) {
        return false;
      }
    }

    for (i = length; i-- !== 0; ) {
      key = keys[i];
      // @ts-expect-error: undefined as key
      if (!isDeeplyEqual(a[key], b[key])) {
        return false;
      }
    }

    return true;
  }

  return a !== a && b !== b;
}

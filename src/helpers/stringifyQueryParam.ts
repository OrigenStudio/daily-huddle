interface AnyObject {
  [key: string]: any;
}

export default function stringifyQueryParam<T extends AnyObject[] | AnyObject>(
  value: T
): string {
  if (
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === "object" && value && Object.keys(value).length === 0)
  ) {
    return "";
  }
  return window.btoa(JSON.stringify(value));
}

export default function parseQueryParam<T>(
  rawValue: string | string[] | undefined,
  defaultValue: T | ((parsed: T) => T)
): T {
  const value = (Array.isArray(rawValue) ? rawValue[0] : rawValue) || "";
  let parsed: null | T = null;
  try {
    parsed = JSON.parse(window.atob(value)) as T;
  } catch (error) {
    // do nothing
  }
  return typeof defaultValue === "function"
    ? // @ts-expect-error: no callable signature
      defaultValue(parsed)
    : parsed ?? defaultValue;
}

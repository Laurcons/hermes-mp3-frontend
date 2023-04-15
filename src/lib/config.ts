const tryGet = <T = string>(key: string, transform?: (val: string) => T): T => {
  if (!import.meta.env[key]) {
    throw new Error(`Couldn't find envvar ${key}`);
  }
  if (transform) {
    return transform(import.meta.env[key]);
  }
  return import.meta.env[key] as T;
};

const maybeGet = <T = string>(
  key: string,
  def: T,
  transform?: (val: string) => T,
): T => {
  const val = import.meta.env[key];
  if (val) {
    if (transform) {
      return transform(val);
    }
    return val as T;
  }
  return def;
};

export const config = {
  apiUrl: tryGet('VITE_API_URL'),
  radioUrl: tryGet('VITE_RADIO_URL'),
  recaptchaSiteKey: maybeGet('VITE_RECAPTCHA_SITE_KEY', ''),
};

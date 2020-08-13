
export function init<T>(ctor: new () => T, props: Partial<T>): T {
  return Object.assign(new ctor(), props);
}

export function nowEpochSeconds(): number {
  return Math.floor(new Date().getTime() / 1000);
}

export function createExpiresDateTime(): number {
  const exp = (nowEpochSeconds() + (60 * 60)) * 1000;
  return Math.floor(new Date(exp).getTime() / 1000);
}

import { toast } from 'react-toastify';

export function handleWsError(err: any) {
  // return (err: any) => {
  return toast.error(err.message);
  // };
}

export const wrapPromise = <TA, T extends Array<TA>, C>(
  func: (callback: (val: C) => void, ...args: T) => void,
) => {
  return (...args: T) => {
    return new Promise<C>((res, rej) => {
      const callback = (thing: any) => {
        if (thing.status === 'error') return rej(thing);
        res(thing);
      };
      func(callback, ...args);
    });
  };
};

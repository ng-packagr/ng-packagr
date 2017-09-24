
export type PromiseCallback<T> = (err: Error, value?: T) => void;

export function promisify<T>(resolver: (resolveOrReject: PromiseCallback<T>) => void): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    resolver(((err: Error, value?: T): void => {
      if (err) {
        reject(err);
      } else {
        resolve(value);
      }
    }))
  });
}

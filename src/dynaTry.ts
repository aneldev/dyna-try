import {
  dynaError,
  IDynaError,
} from "dyna-error";

export const dynaTry = <TResolve>(
  {
    try: try_,
    timeout,
    timeoutError = dynaError({
      code: 600408,
      message: `Try timed out (${timeout}ms)`,
    }),
  }: {
    try: () => Promise<TResolve>;
    timeout: number;
    timeoutError?: IDynaError | Error;
  },
): Promise<TResolve> => {
  return new Promise((resolve, reject) => {
    let isResolved = false;
    let isRejected = false;

    const timer = setTimeout(() => {
      if (isResolved || isRejected) return;
      isRejected = true;
      try {
        reject(timeoutError);
      }
      catch (e) {
        reject(e);
      }
    }, timeout);

    try_()
      .then((d) => {
        clearTimeout(timer);
        if (isRejected) return;
        isResolved = true;
        resolve(d);
      })
      .catch((e) => {
        clearTimeout(timer);
        if (isRejected) return;
        isRejected = true;
        reject(e);
      });

  });
};

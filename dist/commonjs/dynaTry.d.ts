import { IDynaError } from "dyna-error";
export declare const dynaTry: <TResolve>({ try: try_, timeout, timeoutError, }: {
    try: () => Promise<TResolve>;
    timeout: number;
    timeoutError?: IDynaError | Error | undefined;
}) => Promise<TResolve>;

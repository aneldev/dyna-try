# dynaTry with timeout

**Example**

Suppose we have this api get method:
```
const getPerson = (id: string): Promise<IPerson | null> => {
  ...
}
```

Let's try to load this within 5000 seconds

```
dynaTry<IPerson | null>({
  timeout: 5000,
  try: () => getPerson('ID400232'),
})
  .then(person => {
    // Do somthing with this person
  })
  .catch(error => {
    // Call for getPerson's errors
    // or due to timeout.
  });
```

Let's have specific error for the timeout.

```
dynaTry<IPerson | null>({
  timeout: 5000,
  try: () => getPerson('ID400232'),
  timeoutError: new Error('Client timeout'),
})
  .then(person => {
    // Do somthing with this person
  })
  .catch(error => {
    // Called for getPerson's errors
    // In case of timeout the "Client timeout" will be here
  });
```

# API

```
dynaTry = <TResolve>(
  args: {
    try: () => Promise<TResolve>;       // The timedout promise
    timeout: number;                    // Timeout in ms
    timeoutError?: IDynaError | Error;  // Custom timeout error
  },
): Promise<TResolve>                    // dynaTry can resolves value
```

By default, this error is returned in timeout error.

```
dynaError({
  code: 600408,
  message: `Try timed out (${timeout}ms)`,
})
```

Where is the same as...
```
new Error(`Try timed out (${timeout}ms)`);
```
but without the `code`.


import {dynaTry} from "../../src";
import {dynaError} from "dyna-error";

interface IPerson {
  name: string;
  age: number;
}

describe('dynaTry', () => {

  const getPerson = (id: string, delay: number, _test_willFail: boolean = false): Promise<IPerson> => {
    id;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (_test_willFail) {
          reject(new Error("Server error"));
          return;
        }
        resolve({
          name: 'John Smith',
          age: 34,
        });
      }, delay);
    });
  };

  test('Success try', async () => {
    const person = await dynaTry<IPerson>({
      timeout: 1000,
      try: () => getPerson('232', 500),
    });
    expect(person).toMatchSnapshot();
  });

  test('With error', async () => {
    expect.assertions(2);
    try {
      const person = await dynaTry<IPerson>({
        timeout: 1000,
        try: () => getPerson('232', 500, true),
        timeoutError: dynaError({
          code: 600408,
          message: 'Time out',
        }),
      });
      expect(person).toMatchSnapshot();
    }
    catch (e) {
      expect(e.code).not.toBe(600408);
      expect(e.message).toBe('Server error');
    }
  });

  test('With JS error', async () => {
    expect.assertions(2);
    try {
      const person = await dynaTry<IPerson>({
        timeout: 1000,
        try: () => getPerson('232', 500, true),
        timeoutError: new Error('Time out'),
      });
      expect(person).toMatchSnapshot();
    }
    catch (e) {
      expect(e.code).not.toBe(600408);
      expect(e.message).toBe('Server error');
    }
  });

  test('Timeout', async () => {
    expect.assertions(1);
    try {
      const person = await dynaTry<IPerson>({
        timeout: 1000,
        try: () => getPerson('232', 500),
        timeoutError: dynaError({
          code: 600408,
          message: 'Time out',
        }),
      });
      expect(person).toMatchSnapshot();
    }
    catch (e) {
      expect(e.code).toBe(600408);
    }
  });
});

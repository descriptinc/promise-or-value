import { then } from './then';

describe('then', () => {
  it('works on values', () => {
    const fn = jest.fn((result: number) => result * 2);
    expect(then(5, fn)).toBe(10);
    expect(fn).toHaveBeenCalledWith(5, true);
  });
  it('works on promises', async () => {
    const fn = jest.fn((result: number) => result * 2);
    await expect(then(Promise.resolve(5), fn)).resolves.toBe(10);
    expect(fn).toHaveBeenCalledWith(5);
  });
  it('throws on sync error in map', () => {
    expect(() =>
      then(5, (result) => {
        throw new Error('result:' + result * 2);
      }),
    ).toThrowError('result:10');
  });
  it('throws on rejected error in mapping', async () => {
    await expect(() =>
      then(5, (result) => {
        return Promise.reject(new Error('result:' + result * 2));
      }),
    ).rejects.toThrowError('result:10');
  });
  it('throws on rejected error in source', async () => {
    await expect(
      then(Promise.reject('sadness'), (result) => result * 2),
    ).rejects.toBe('sadness');
  });
  it('runs custom handler', async () => {
    const onValue = jest.fn((result: number) => result * 2);
    const onError = jest.fn(() => 100);
    await expect(
      then(Promise.reject('sadness'), onValue, onError),
    ).resolves.toBe(100);
    expect(onError).toHaveBeenCalledWith('sadness');
  });
});

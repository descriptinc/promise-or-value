import { all } from './all';

describe('all', () => {
  it('returns value array as-is', () => {
    const array = [1, 2, 3];
    expect(all(array)).toBe(array);
  });
  it('returns promise for array with 1 promise', async () => {
    const array = [1, 2, Promise.resolve(3)];
    const result = all(array);
    expect(result).not.toBe(array);
    await expect(result).resolves.toEqual([1, 2, 3]);
  });
  it('rejects if a value rejects', async () => {
    const array = [1, Promise.reject(2), 3];
    await expect(all(array)).rejects.toBe(2);
  });
});

import { getOrAdd } from './cache';
import { PromiseOrValue } from './type';

describe('getOrAdd', () => {
  it('works on values', () => {
    const cache = new Map<string, PromiseOrValue<number>>();
    const fn = jest.fn(() => 5);
    expect(getOrAdd(cache, 'foo', fn)).toBe(5);
    expect(getOrAdd(cache, 'foo', fn)).toBe(5);
    expect(getOrAdd(cache, 'bar', fn)).toBe(5);
    expect(fn).toHaveBeenCalledTimes(2);
  });
  it('works on promises', async () => {
    const cache = new Map<string, PromiseOrValue<number>>();
    const fn = jest.fn(() => Promise.resolve(5));
    await expect(getOrAdd(cache, 'foo', fn)).resolves.toBe(5);
    expect(getOrAdd(cache, 'foo', fn)).toBe(5);
    expect(fn).toHaveBeenCalledTimes(1);

    const bar = getOrAdd(cache, 'bar', fn);
    expect(bar).toBeInstanceOf(Promise);
    expect(getOrAdd(cache, 'bar', fn)).toBe(bar);
    await expect(getOrAdd(cache, 'bar', fn)).resolves.toBe(5);
    expect(getOrAdd(cache, 'bar', fn)).toBe(5);
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

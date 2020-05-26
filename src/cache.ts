/*
 * cache.ts
 * descript-web-v2
 *
 * Last modified by marcello on 5/26/20, 1:27 PM
 * Copyright © 2020 Descript, Inc. All rights reserved.
 */

import { PromiseOrValue } from './type';

export type PromiseOrValueMapLike<K, V> = {
  get(key: K): PromiseOrValue<V> | undefined;
  set(key: K, value: PromiseOrValue<V>): void;
};

export function getOrAdd<K, V>(
  cache: PromiseOrValueMapLike<K, V>,
  key: K,
  compute: (key: K) => PromiseOrValue<V>,
): PromiseOrValue<V> {
  const existing = cache.get(key);
  if (existing) {
    return existing;
  }
  let resultOrPromise = compute(key);
  if (resultOrPromise instanceof Promise) {
    // Return a promise that resolves after the cache has been updated
    resultOrPromise = resultOrPromise.then((result) => {
      cache.set(key, result);
      return result;
    });
  }
  cache.set(key, resultOrPromise);
  return resultOrPromise;
}

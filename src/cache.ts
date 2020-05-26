/*
 * cache.ts
 * descript-web-v2
 *
 * Last modified by marcello on 5/26/20, 1:27 PM
 * Copyright © 2020 Descript, Inc. All rights reserved.
 */

import { PromiseOrValue } from './type';

export type PromiseOrValueMap<K, V> = CacheLike<K, PromiseOrValue<V>>;

export function getOrAdd<K, V>(
  cache: PromiseOrValueMap<K, V>,
  key: K,
  compute: (key: K) => PromiseOrValue<V>,
): PromiseOrValue<V> {
  const existing = cache.get(key);
  if (existing) {
    return existing;
  }
  const resultOrPromise = compute(key);
  cache.set(key, resultOrPromise);
  if (resultOrPromise instanceof Promise) {
    return resultOrPromise.then((result) => {
      cache.set(key, result);
      return result;
    });
  }
  return resultOrPromise;
}

export type CacheLike<K, V> = {
  get(key: K): V | undefined;
  set(key: K, value: V): void;
};

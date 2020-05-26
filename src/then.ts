/*
 * map.ts
 * descript-web-v2
 *
 * Last modified by marcello on 5/26/20, 1:28 PM
 * Copyright © 2020 Descript, Inc. All rights reserved.
 */

import { PromiseOrValue } from './type';

const throwingErrorCallback = (e: any) => {
  throw e;
};

export function then<T, V>(
  value: PromiseOrValue<T>,
  onValue: (t: T, sync?: true) => PromiseOrValue<V>,
  onError: (error: any) => PromiseOrValue<V> = throwingErrorCallback,
): PromiseOrValue<V> {
  if (value instanceof Promise) {
    return value.then(onValue).catch(onError);
  }
  try {
    return onValue(value, true);
  } catch (e) {
    return onError(e);
  }
}

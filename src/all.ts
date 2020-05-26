/*
 * all.ts
 * descript-web-v2
 *
 * Last modified by marcello on 5/26/20, 1:28 PM
 * Copyright © 2020 Descript, Inc. All rights reserved.
 */

import { PromiseOrValue } from './type';

export function all<T>(values: PromiseOrValue<T>[]): PromiseOrValue<T[]> {
  for (const value of values) {
    if (value instanceof Promise) {
      return Promise.all(values);
    }
  }
  return values as T[];
}

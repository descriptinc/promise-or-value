# promise-or-value

[![Actions Status](https://github.com/descriptinc/promise-or-value/workflows/Node%20CI/badge.svg)](https://github.com/descriptinc/promise-or-value/actions)
[![npm version](https://badge.fury.io/js/promise-or-value.svg)](https://badge.fury.io/js/promise-or-value)
[![codecov](https://codecov.io/gh/descriptinc/promise-or-value/branch/master/graph/badge.svg)](https://codecov.io/gh/descriptinc/promise-or-value)

This module is designed around the idea of a custom TypeScript type:

```typescript
type PromiseOrValue<T> = Promise<T> | T;
```

The motivations for this type is because `Promise`s resolve asynchronously, even if you call `then` on an already-
resolved promise (e.g. `Promise.resolve(5).then(() => …)`).

Promises work this way by design! It avoids bugs.

But for performance-critical code where you're working with cacheable async data in a loop, it can be too slow.

## API

### `then(pov, onValue, onError)` - "fast" equivalent of `Promise.resolve(pov).then(onValue).catch(onError)`

```typescript
export function then<T, V>(
  value: PromiseOrValue<T>,
  onValue: (t: T, sync?: true) => PromiseOrValue<V>,
  onError: (error: any) => PromiseOrValue<V> = throwingErrorCallback,
): PromiseOrValue<V>;
```

Run some logic immediately on values, or later, for promises.

### `all(povs)` - "fast" equivalent of `Promise.all(povs)`

```typescript
export function all<T>(values: PromiseOrValue<T>[]): PromiseOrValue<T[]>;
```

Returns array as-is if everything is a value, or calls `Promise.all` if there are any promises in the array

### `PromiseOrValueMapLike` - for caching promise data

```typescript
type PromiseOrValueMapLike<K, V> = {
  get(key: K): PromiseOrValue<V> | undefined;
  set(key: K, value: PromiseOrValue<V>): void;
};
```

A type used by `getOrAdd`. A simple conforming cache can be made with `new Map<K, PromiseOrValue<V>>()`.

### `getOrAdd` - for working with `PromiseOrValueMapLike`

```typescript
export function getOrAdd<K, V>(
  cache: PromiseOrValueMapLike<K, V>,
  key: K,
  compute: (key: K) => PromiseOrValue<V>,
): PromiseOrValue<V>;
```

If the key exists in the cache, returns it, otherwise computes it and inserts it in the cache. If the computation 
returns a promise, the promise is inserted in the cache, and replaced with the literal value once it resolves. 

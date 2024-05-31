export type Curry2 = <A, B, Z>(fn: (a: A, b: B) => Z)
  => (a: A)
  => (b: B)
  => Z;

export const curry2: Curry2 = (fn) => (a) => (b) => fn(a, b);

export type Curry3 = <A, B, C, Z>(fn: (a: A, b: B, c: C) => Z)
  => (a: A)
  => (b: B)
  => (c: C)
  => Z;

export const curry3: Curry3 = (fn) => (a) => (b) => (c) => fn(a, b, c);

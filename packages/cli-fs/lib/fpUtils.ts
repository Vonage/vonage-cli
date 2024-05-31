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

export type Curry4 = <A, B, C, D, Z>(fn: (a: A, b: B, c: C, d: D) => Z)
  => (a: A)
  => (b: B)
  => (c: C)
  => (d: D)
  => Z;

export const curry4: Curry4 = (fn) => (a) => (b) => (c) => (d) => fn(a, b, c, d);

export type Curry5 = <A, B, C, D, E, Z>(fn: (a: A, b: B, c: C, d: D, e: E) => Z)
  => (a: A)
  => (b: B)
  => (c: C)
  => (d: D)
  => (e: E)
  => Z;

export const curry5: Curry5 = (fn) => (a) => (b) => (c) => (d) => (e) => fn(a, b, c, d, e);


export type Curry9 = <A, B, C, D, E, F, G, H, I, Z>(fn: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I) => Z)
  => (a: A)
  => (b: B)
  => (c: C)
  => (d: D)
  => (e: E)
  => (f: F)
  => (g: G)
  => (h: H)
  => (i: I)
  => Z;

export const curry9: Curry9 = (fn) => (a) => (b) => (c) => (d) => (e) => (f) => (g) => (h) => (i) => fn(a, b, c, d, e, f, g, h, i);

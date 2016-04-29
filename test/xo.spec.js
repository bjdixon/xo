'use strict';
const xo = require('..');

describe('xo.VERSION', () => {

  it('returns correct version number', () => {
    expect(xo.VERSION).toBe('3.0.0');
  });

});

describe('xo.noConflict', () => {

  const ox = xo.noConflict();

  it('can be assigned to another namespace', () => {
    expect(ox.hasOwnProperty('memoize')).toEqual(true);
  });

  it('alternate namespace version can coexist with xo assigned a different value', () => {
    const xo = { a: 1, b: 2 };
    expect(ox.hasOwnProperty('flatten')).toEqual(true);
    expect(xo).toEqual({ a: 1, b: 2 });
  });

});

describe('xo.memoize', () => {

  it('returns same value as non memoized functions (single argument)', () => {
    const upper = str => str.toUpperCase();
    const memoUpper = xo.memoize(upper);
    expect(memoUpper('foo')).toEqual(upper('foo'));
  });

  it('returns same value as non memoized fat arrow functions (single argument)', () => {
    const upper = (str) => str.toUpperCase();
    const memoUpper = xo.memoize(upper);
    expect(memoUpper('foo')).toEqual(upper('foo'));
  });

  it('returns same value as non memoized functions (multiple arguments)', () => {
    const id = (str1, str2, str3) => {
      const args = Array.prototype.slice.call(arguments);
      return args.join(', ');
    };
    const memoId = xo.memoize(id);
    expect(memoId('foo', 'bar', 'baz')).toEqual(id('foo', 'bar', 'baz'));
  });

  it('returns same value as non memoized fat arrow functions (multiple arguments)', () => {
    const id = (str1, str2, str3) => {
      const args = Array.prototype.slice.call(arguments);
      return args.join(', ');
    };
    const memoId = xo.memoize(id);
    expect(memoId('foo', 'bar', 'baz')).toEqual(id('foo', 'bar', 'baz'));
  });

  it('returns same value as non memoized functions (array argument)', () => {
    const testArg = ['foo', 'bar', 'baz'];
    const id = args => args.join(', ');
    const memoId = xo.memoize(id);
    expect(memoId(testArg)).toEqual(id(testArg));
  });

  it('returns same value as non memoized functions (object argument)', () => {
    const testArg = { a: 'foo', b: { c:'bar', d: 'baz' }};
    const id = args => args.a + args.b.c + args.b.d;
    const memoId = xo.memoize(id);
    expect(memoId(testArg)).toEqual(id(testArg));
  });

  it('returns cached value, doesn\'t run (expensive) function again', () => {
    const testArg = { a: 'foo', b: { c: 1, d: 'baz' }};
    let check = 0;
    const id = args => {
      check += 1;
      return args.b.c;
    };
    const memoId = xo.memoize(id);
    // Each time id() is invoked it will incremement check.
    // Using the memoized version we get the same return value as we would when invoking id()
    // but without invoking id() more than once (and incrementing check).
    let test = memoId(testArg);
    test = memoId(testArg);
    test = memoId(testArg);
    expect(test).toEqual(check);
  });

  it('returns cached value, doesn\'t run (expensive) function again unless arguments change', () => {
    let check = 0;
    const upper = (args) => {
      check += 1;
      return args.toUpperCase();
    };
    const memoUpper = xo.memoize(upper);
    let test1 = memoUpper('hello'); // check = 1
    test1 = memoUpper('hello'); // check = 1
    let test2 = memoUpper('world'); // check = 2
    test2 = memoUpper('world'); // check = 2
    test1 = memoUpper('hello'); // check = 2
    expect([test1, test2, check].join(' ')).toEqual('HELLO WORLD 2');
  });

});

describe('xo.flatten', () => {

  it('returns flattened array', () => {
    const test = [0, 1, [2, 3], [4, [5, 6]], 7, [8, [9]]];
    const result = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    expect(xo.flatten(test)).toEqual(result);
  });

});

describe('xo.compact', () => {

  it('returns array with falsy values removed', () => {
    const test = [1, undefined, false, 2, undefined, 3, false, 4, 5];
    const result = [1, 2, 3, 4, 5];
    expect(xo.compact(test)).toEqual(result);
  });

});

describe('xo.partial', () => {

  it('takes a function when initializing and an argument when invoking', () => {
    const greet = name => 'hi ' + name;
    const hi = xo.partial(greet);
    expect(hi('Bob')).toEqual('hi Bob');
  });

  it('takes a fat arrow function when initializing and an argument when invoking', () => {
    const greet = name => 'hi ' + name;
    const hi = xo.partial(greet);
    expect(hi('Bob')).toEqual('hi Bob');
  });

  it('takes a fat arrow function and an argument when initializing and a final argument when invoking', () => {
    const greet = (greeting, name) => greeting + ' ' + name;
    const hi = xo.partial(greet, 'hi');
    expect(hi('Bob')).toEqual('hi Bob');
  });

  it('takes a function when initializing and multiple arguments when invoking', () => {
    const greet = (greeting, name) => greeting + ' ' + name;
    const hi = xo.partial(greet);
    expect(hi('hi', 'Bob')).toEqual('hi Bob');
  });

  it('takes a fat arrow function when initializing and multiple arguments when invoking', () => {
    const greet = (greeting, name) => greeting + ' ' + name;
    const hi = xo.partial(greet);
    expect(hi('hi', 'Bob')).toEqual('hi Bob');
  });

  it('takes a function when initializing an argument and context when invoking', () => {
    function Greet(greeting, name) {
      this.greeting = greeting;
      this.name = name;
    }
    Greet.prototype.speak = function() {
      return this.greeting + ' ' + this.name;
    };
    const Hi = xo.partial(Greet, 'hi');
    const hiBob = new Hi('Bob');
    expect(Greet.prototype.speak.call(hiBob)).toEqual('hi Bob');
  });

});

describe('xo.curry', () => {

  it('takes a function when initializing and an argument when invoking', () => {
    const greet = name => 'hi ' + name;
    const hi = xo.curry(greet);
    expect(hi('Bob')).toEqual('hi Bob');
  });

  it('takes a fat arrow function when initializing and an argument when invoking', () => {
    const greet = (name) => 'hi ' + name;
    const hi = xo.curry(greet);
    expect(hi('Bob')).toEqual('hi Bob');
  });

  it('takes a fat arrow function and an argument when initializing and a final argument when invoking', () => {
    const greet = (greeting, name) => greeting + ' ' + name;
    const hi = xo.curry(greet, 'hi');
    expect(hi('Bob')).toEqual('hi Bob');
  });

  it('takes a function when initializing and multiple arguments when invoking', () => {
    const greet = (greeting, name) => greeting + ' ' + name;
    const hi = xo.curry(greet);
    expect(hi('hi', 'Bob')).toEqual('hi Bob');
  });

  it('takes a fat arrow function when initializing and multiple arguments when invoking', () => {
    const greet = (greeting, name) => greeting + ' ' + name;
    const hi = xo.curry(greet);
    expect(hi('hi', 'Bob')).toEqual('hi Bob');
  });

  it('allows arguments to be applied one at a time or all at once', () => {
    const greet = (greeting, name) => greeting + ' ' + name;
    const hi = xo.curry(greet);
    expect(hi('hi', 'Bob')).toEqual(hi('hi')('Bob'));
  });

  it('allows arguments to be applied one at a time or all at once when there are many arguments', () => {
    const add5Things = (arg1, arg2, arg3, arg4, arg5) => arg1 + arg2 + arg3 + arg4 + arg5;
    expect(xo.curry(add5Things)(1, 2, 3, 4, 5)).toEqual(xo.curry(add5Things)(1)(2)(3)(4)(5));
  });

  it('takes a function when initializing an argument and context when invoking', () => {
    function Greet(greeting, name) {
      this.greeting = greeting;
      this.name = name;
    }
    Greet.prototype.speak = function() {
      return this.greeting + ' ' + this.name;
    };
    const Hi = xo.curry(Greet, 'hi');
    const hiBob = new Hi('Bob');
    expect(Greet.prototype.speak.call(hiBob)).toEqual('hi Bob');
  });

});

describe('xo.findIndex', () => {

  it('returns correct index of object where property is found', () => {
    const compare = (id, obj) => id === obj.id;
    const objArr = [
      { name: 'a', id: '001' },
      { name: 'b', id: '002' },
      { name: 'c', id: '003' },
      { name: 'd', id: '004' }
    ];
    expect(xo.findIndex(xo.curry(compare, '003'), objArr)).toEqual(2);
  });

  it('returns -1 when no match is made', () => {
    const compare = (id, obj) => id === obj.id;
    const objArr = [
      { name: 'a', id: '001' },
      { name: 'b', id: '002' },
      { name: 'c', id: '003' },
      { name: 'd', id: '004' }
    ];
    expect(xo.findIndex(xo.curry(compare, '005'), objArr)).toEqual(-1);
  });

  it('returns index of first occurence when multiple matches can be made', () => {
    const compare = (id, obj) => id === obj.id;
    const objArr = [
      { name: 'a', id: '001' },
      { name: 'b', id: '003' },
      { name: 'c', id: '003' },
      { name: 'd', id: '003' }
    ];
    expect(xo.findIndex(xo.curry(compare, '003'), objArr)).toEqual(1);
  });

});

describe('xo.findKey', () => {

  it('returns correct key of object where property is found', () => {
    const compare = (id, obj) => id === obj.id;
    const obj = {
      hello: { name: 'a', id: '001' },
      goodbye: { name: 'b', id: '002' },
      yes: { name: 'c', id: '003' },
      no: { name: 'd', id: '004' }
    };
    expect(xo.findKey(xo.curry(compare, '003'), obj)).toEqual('yes');
  });

  it('returns null when no match is made', () => {
    const compare = (id, obj) => id === obj.id;
    const obj = {
      hello: { name: 'a', id: '001' },
      goodbye: { name: 'b', id: '002' },
      yes: { name: 'c', id: '003' },
      no: { name: 'd', id: '004' }
    };
    expect(xo.findKey(xo.curry(compare, '005'), obj)).toEqual(null);
  });

  it('returns key of first occurence when multiple matches can be made', () => {
    const compare = (id, obj) => id === obj.id;
    const obj = {
      hello: { name: 'a', id: '001' },
      goodbye: { name: 'b', id: '003' },
      yes: { name: 'c', id: '003' },
      no: { name: 'd', id: '004' }
    };
    expect(xo.findKey(xo.curry(compare, '003'), obj)).toEqual('goodbye');
  });

});

describe('xo.find', () => {

  it('returns correct value of object where property is found', () => {
    const compare = (id, obj) => id === obj.id;
    const obj = {
      hello: { name: 'a', id: '001' },
      goodbye: { name: 'b', id: '002' },
      yes: { name: 'c', id: '003' },
      no: { name: 'd', id: '004' }
    };
    expect(xo.find(xo.curry(compare, '003'), obj)).toEqual({ name: 'c', id: '003' });
  });

  it('returns null when no match is made', () => {
    const compare = (id, obj) => id === obj.id;
    const obj = {
      hello: { name: 'a', id: '001' },
      goodbye: { name: 'b', id: '002' },
      yes: { name: 'c', id: '003' },
      no: { name: 'd', id: '004' }
    };
    expect(xo.find(xo.curry(compare, '005'), obj)).toEqual(null);
  });

  it('returns value of first occurence when multiple matches can be made', () => {
    const compare = (id, obj) => id === obj.id;
    const obj = {
      hello: { name: 'a', id: '001' },
      goodbye: { name: 'b', id: '003' },
      yes: { name: 'c', id: '003' },
      no: { name: 'd', id: '004' }
    };
    expect(xo.find(xo.curry(compare, '003'), obj)).toEqual({ name: 'b', id: '003' });
  });

  it('returns correct value of array where value is found', () => {
    const compare = (id, obj) => id === obj.id;
    const objArr = [
      { name: 'a', id: '001' },
      { name: 'b', id: '002' },
      { name: 'c', id: '003' },
      { name: 'd', id: '004' }
    ];
    expect(xo.find(xo.curry(compare, '003'), objArr)).toEqual({ name: 'c', id: '003' });
  });

  it('returns null when no match is made', () => {
    const compare = (id, obj) => id === obj.id;
    const objArr = [
      { name: 'a', id: '001' },
      { name: 'b', id: '002' },
      { name: 'c', id: '003' },
      { name: 'd', id: '004' }
    ];
    expect(xo.find(xo.curry(compare, '005'), objArr)).toEqual(null);
  });

  it('returns value of first occurence when multiple matches can be made', () => {
    const compare = (id, obj) => id === obj.id;
    const objArr = [
      { name: 'a', id: '001' },
      { name: 'b', id: '003' },
      { name: 'c', id: '003' },
      { name: 'd', id: '004' }
    ];
    expect(xo.find(xo.curry(compare, '003'), objArr)).toEqual({ name: 'b', id: '003' });
  });

});

describe('xo.filter', () => {

  it('returns array of objects where property is found', () => {
    const compare = (id, obj) => id === obj.id;
    const objArr = [
      { name: 'a', id: '001' },
      { name: 'b', id: '003' },
      { name: 'c', id: '003' },
      { name: 'd', id: '004' }
    ];
    expect(xo.filter(xo.curry(compare, '003'), objArr).length).toEqual(2);
  });

  it('returns empty array when no match is made', () => {
    const compare = (id, obj) => id === obj.id;
    const objArr = [
      { name: 'a', id: '001' },
      { name: 'b', id: '002' },
      { name: 'c', id: '003' },
      { name: 'd', id: '004' }
    ];
    expect(xo.filter(xo.curry(compare, '005'), objArr)).toEqual([]);
  });

});

describe('xo.isBoolean', () => {

  it('returns true for booleans', () => {
    const bool = false;
    expect(xo.isBoolean(bool)).toEqual(true);
  });

  it('returns false for non booleans', () => {
    const notBool = 'true';
    expect(xo.isBoolean(notBool)).toEqual(false);
  });

});

describe('xo.isNumber', () => {

  it('returns true for numbers', () => {
    const number = 3;
    expect(xo.isNumber(number)).toEqual(true);
  });

  it('returns false for non numbers', () => {
    const notNumber = '3';
    expect(xo.isNumber(notNumber)).toEqual(false);
  });

});

describe('xo.isString', () => {

  it('returns true for strings', () => {
    const string  = '42';
    expect(xo.isString(string)).toEqual(true);
  });

  it('returns false for non strings', () => {
    const notString = true;
    expect(xo.isString(notString)).toEqual(false);
  });

});

describe('xo.isObject', () => {

  it('returns true for objects', () => {
    const object = {a: '1', b: '2'};
    expect(xo.isObject(object)).toEqual(true);
  });

  it('returns false for non objects', () => {
    const notObject = true;
    expect(xo.isObject(notObject)).toEqual(false);
  });

});

describe('xo.isArray', () => {

  it('returns true for arrays', () => {
    const array = [1, 2, 3];
    expect(xo.isArray(array)).toEqual(true);
  });

  it('returns false for non arrays', () => {
    const notArray= true;
    expect(xo.isArray(notArray)).toEqual(false);
  });

});

describe('xo.isFunction', () => {

  it('returns true for functions', () => {
    const func = () => true;
    expect(xo.isFunction(func)).toEqual(true);
  });

  it('returns true for 1 statement fat arrow functions', () => {
    const func = () => true;
    expect(xo.isFunction(func)).toEqual(true);
  });

  it('returns true for multi-statement fat arrow functions', () => {
    const func = () => { let x = 1; return x; };
    expect(xo.isFunction(func)).toEqual(true);
  });

  it('returns false for non functions', () => {
    const notFunction = true;
    expect(xo.isFunction(notFunction)).toEqual(false);
  });

});

describe('xo.maybe', () => {

  it('invokes a function if it has truthy arguments', () => {
    const sum = (a, b) => a + b;
    const maybeSum = xo.maybe(sum);
    expect(xo.isNumber(maybeSum(2, 3))).toEqual(true);
  });

  it('invokes a fat arrow function if it has truthy arguments', () => {
    const sum = (a, b) => a + b;
    const maybeSum = xo.maybe(sum);
    expect(xo.isNumber(maybeSum(2, 3))).toEqual(true);
  });

  it('doesn\'t invoke a function if it has zero arguments', () => {
    const sum = (a, b) => a + b;
    const maybeSum = xo.maybe(sum);
    expect(maybeSum()).toEqual(undefined);
  });

  it('doesn\'t invoke a fat arrow function if it has zero arguments', () => {
    const sum = (a, b) => a + b;
    const maybeSum = xo.maybe(sum);
    expect(maybeSum()).toEqual(undefined);
  });

  it('doesn\'t invoke a function if it has null arguments', () => {
    const sum = (a, b) => a + b;
    const maybeSum = xo.maybe(sum);
    expect(maybeSum(null, 4)).toEqual(undefined);
  });

  it('doesn\'t invoke a fat arrow function if it has null arguments', () => {
    const sum = (a, b) => a + b;
    const maybeSum = xo.maybe(sum);
    expect(maybeSum(null, 4)).toEqual(undefined);
  });

  it('doesn\'t invoke a function if it has undefined arguments', () => {
    const sum = (a, b) => a + b;
    const maybeSum = xo.maybe(sum);
    expect(maybeSum(4, undefined)).toEqual(undefined);
  });

  it('doesn\'t invoke a fat arrow function if it has undefined arguments', () => {
    const sum = (a, b) => a + b;
    const maybeSum = xo.maybe(sum);
    expect(maybeSum(4, undefined)).toEqual(undefined);
  });

});

describe('xo.compose', () => {

  it('invokes the composed functions in reverse order', () => {
    const increment = a => a + 1;
    const square = a => a * a;
    const squarePlusOne = xo.compose(increment, square);
    expect(squarePlusOne(3)).toEqual(10);
  });

  it('is associative', () => {
    const increment = a => a + 1;
    const square = a => a * a;
    const cube = a => a * a * a;
    expect(xo.compose(increment, square, cube)(3)).toEqual(xo.compose(xo.compose(increment, square), cube)(3));
  });

});

describe('xo.pipe', () => {

  it('invokes the piped functions in order', () => {
    const increment = a => a + 1;
    const square = a => a * a;
    const plusOneSquare = xo.pipe(increment, square);
    expect(plusOneSquare(3)).toEqual(16);
  });

  it('is associative', () => {
    const increment = a => a + 1;
    const square = a => a * a;
    const cube = a => a * a * a;
    expect(xo.pipe(increment, square, cube)(3)).toEqual(xo.pipe(xo.pipe(increment, square), cube)(3));
  });

});

describe('xo.map', () => {

  it('returns an array that is the same length as the array being operated on', () => {
    const arr = [1, 2, 3, 4, 5];
    const square = a => a * a;
    const output = xo.map(square, arr);
    expect(output.length).toEqual(arr.length);
  });

  it('returns an array that contains the correct values after being operated on', () => {
    const arr = [1, 2, 3, 4, 5];
    const square = a => a * a;
    const output = xo.map(square, arr);
    expect(output[0]).toEqual(1);
    expect(output[1]).toEqual(4);
    expect(output[2]).toEqual(9);
    expect(output[3]).toEqual(16);
    expect(output[4]).toEqual(25);
  });

});

describe('xo.reduce', () => {

  it('returns the correct value after being operated on', () => {
    const arr = [1, 2, 3, 4, 5];
    const sum = (a, b) => a + b;
    expect(xo.reduce(sum, 0, arr)).toEqual(15);
  });

});


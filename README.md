[![Build Status](https://travis-ci.org/bjdixon/xo.svg?branch=master)](https://travis-ci.org/bjdixon/xo)
[![Coverage Status](https://coveralls.io/repos/bjdixon/xo/badge.svg?branch=master&service=github)](https://coveralls.io/github/bjdixon/xo?branch=v2)
[![Dependency Status](https://david-dm.org/bjdixon/xo.svg)](https://david-dm.org/bjdixon/xo)
[![devDependency Status](https://david-dm.org/bjdixon/xo/dev-status.svg)](https://david-dm.org/bjdixon/xo#info=devDependencies)

Helper utils for working with functions, arrays and objects in JavaScript. Full documentation at http://bjdixon.github.io/xo/

## Introduction
xo is a library I use to work with functions, arrays and objects in JavaScript.

##Source code
The source is available at:
[http://github.com/bjdixon/xo](http://github.com/bjdixon/xo).

##Installation

####Browser

Download and add to your html pages.

```html
<script type="text/javascript" src="xo.min.js"></script>
```

####Node

Using [npm](https://www.npmjs.com/package/xo-utils):

```sh
npm install xo-utils
```

```javascript
var xo = require('xo-utils');

var curry = require('xo-utils').curry;
```

##Contains

* [curry](#curry)
* [compose](#compose)
* [pipe](#pipe)
* [filter](#filter)
* [findIndex](#findIndex)
* [findKey](#findKey)
* [find](#find)
* [flatten](#flatten)
* [compact](#compact)
* [memoize](#memoize)
* [isArray](#isArray)
* [isFunction](#isFunction)
* [isObject](#isObject)
* [isString](#isString)
* [isNumber](#isNumber)
* [isBoolean](#isBoolean)
* [maybe](#maybe)
* [partial](#partial)

##Usage

####curry

Takes a function and zero or more arguments to that function. Returns a function that can be invoked with remaining arguments at a later time.

```javascript
const add = (a, b) => a + b;

const addTen = xo.curry(add, 10);

addTen(32); // => 42
```

####compose

Takes functions and returns a function. The returned function when invoked will invoke each function that was supplied as an argument to compose (in reverse order) passing the the return value of each as an argument to the next function.

```javascript
const increment = (a) => a + 1;
const square = (a) => a * a;

const squarePlusOne = xo.compose(increment, square);
squarePlusOne(3); // => 10
```

####pipe

Takes functions and returns a function. The returned function when invoked will invoke each function that was supplied as an argument to pipe (in the order supplied) passing the the return value of each as an argument to the next function.

```javascript
const increment = (a) => a + 1;
const square = (a) => a * a;

const plusOneSquare = xo.pipe(increment, square);
plusOneSquare(3); // => 16
```

####filter

Takes an array and a predicate. Returns an array with only those terms that pass the predicate.

```javascript
const compare = (id, obj) => id === obj.id;
const objArr = [
  { name: 'a', id: '001' },
  { name: 'b', id: '003' },
  { name: 'c', id: '003' },
  { name: 'd', id: '004' }
];
xo.filter(objArr, xo.curry(compare, '003')); // => [{ name: 'b', id: '003'},{name: 'c', id: '003'}] 
```

####findIndex

Takes an array and a predicate. Returns the index of the first term that passes the predicate.

```javascript
const compare = (id, obj) => id === obj.id;
const objArr = [
  { name: 'a', id: '001' },
  { name: 'b', id: '002' },
  { name: 'c', id: '003' },
  { name: 'd', id: '004' }
];
xo.findIndex(objArr, xo.curry(compare, '003')); // => 2
```

####findKey

Takes an object and a predicate. Returns the key of the first term that passes the predicate.

```javascript
const compare = (id, obj) => id === obj.id;
const obj = {
  hello: { name: 'a', id: '001' },
  goodbye: { name: 'b', id: '002' },
  yes: { name: 'c', id: '003' },
  no: { name: 'd', id: '004' }
} ;
xo.findKey(obj, xo.curry(compare, '003')); // => 'yes'
```

####find

Takes an object or an array  and a predicate. Returns the value of the first term that passes the predicate.

```javascript
const compare = (id, obj) => id === obj.id;
const obj = {
  hello: { name: 'a', id: '001' },
  goodbye: { name: 'b', id: '002' },
  yes: { name: 'c', id: '003' },
  no: { name: 'd', id: '004' }
};
const objArr = [
  { name: 'a', id: '001' },
  { name: 'b', id: '002' },
  { name: 'c', id: '003' },
  { name: 'd', id: '004' }
];
xo.find(obj, xo.curry(compare, '003')); // => { name: 'c', id: '003' }
xo.find(objArr, xo.curry(compare, '003')); // => { name: 'c', id: '003' }
```

####flatten

Takes an n-dimensional nested array. Returns a flattened 1-dimension array.

```javascript
const test = [0, 1, [2, 3], [4, [5, 6]], 7, [8, [9]]];
xo.flatten(test); // => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
```

####compact

Takes an array. Returns an array with all falsy values removed.

```javascript
const test = [1, , false, 2, 3, false];
xo.compact(test); // => [1, 2, 3]
```

####memoize

Takes a function and returns a functions. Invoking the returned function will return cached results if the same arguments have been provided during previous invocations.

```javascript
const upper = (str) => str.toUpperCase();
const memoUpper = xo.memoize(upper);
memoUpper('foo'); // => "FOO"
memoUpper('foo'); // => "FOO" (cached version)
```

####isArray

Type check for Array.

```javascript
xo.isArray([1, 2, 3]); // => true
xo.isArray(true); // => false
```

####isFunction

Type check for Function.

```javascript
xo.isFunction(function(){ return true; }); // => true
xo.isFunction(true); // => false
```

####isObject

Type check for Object.

```javascript
xo.isObject({ a: true }); // => true
xo.isObject(true); // => false
```

####isString

Type check for String.

```javascript
xo.isString('true'); // => true
xo.isString(true); // => false
```

####isNumber

Type check for Number.

```javascript
xo.isNumber(42); // => true
xo.isNumber('true'); // => false
```

####isBoolean

Type check for Boolean.

```javascript
xo.isBoolean(true); // => true
xo.isBoolean('true'); // => false
```

####maybe

Takes a function and returns a function. The returned function will not be invoked if supplied with null or undefined arguments.

```javascript
const sum = (a, b) => a + b;
const maybeSum = xo.maybe(sum);
maybeSum(2, 3); // => 5
maybeSum(null, 3); // doesn't invoke sum
```

####partial

Takes a function and zero or more arguments to that function. Returns a function that can be invoked with remaining arguments at a later time.

```javascript
const add = (a, b) => a + b;

const addTen = xo.partial(add, 10);

addTen(32); // => 42
```

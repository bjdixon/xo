[![Build Status](https://travis-ci.org/bjdixon/xo.svg?branch=master)](https://travis-ci.org/bjdixon/xo)
[![Coverage Status](https://coveralls.io/repos/bjdixon/xo/badge.svg?branch=master&service=github)](https://coveralls.io/github/bjdixon/xo?branch=master)
[![Dependency Status](https://david-dm.org/bjdixon/xo.svg)](https://david-dm.org/bjdixon/xo)
[![devDependency Status](https://david-dm.org/bjdixon/xo/dev-status.svg)](https://david-dm.org/bjdixon/xo#info=devDependencies)

Helper utils for working with functions and arrays in JavaScript. Full documentation at http://bjdixon.github.io/xo/

## Introduction
xo is essentially a stripped down version of an underscore/lodash type library. I've only implemented the functions that I use the most and those that can be used to create the remaining functions from these types of library.

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
```

##Contains

* [partial](#partial)
* [filter](#filter)
* [findIndex](#findIndex)
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

##Usage

####partial

Takes a callback and zero or more arguments to that callback. Returns a function that can be invoked with remaining arguments at a later time.

```javascript
function add(a, b) {
  return a + b;
}

var addTen = xo.partial(add, 10);

addTen(32); // => 42
```

####filter

Takes an array and a predicate callback. Returns an array with only those terms that pass the predicate.

```javascript
function compare(id, obj) {
  return id === obj.id;
}
var objArr = [
  { name: 'a', id: '001' },
  { name: 'b', id: '003' },
  { name: 'c', id: '003' },
  { name: 'd', id: '004' }
];
xo.filter(objArr, xo.partial(compare, '003')); // => [{ name: 'b', id: '003'},{name: 'c', id: '003'}] 
```

####findIndex

Takes an array and a predicate callback. Returns the index of the first term that passes the predicate.

```javascript
function compare(id, obj) {
  return id === obj.id;
}
var objArr = [
  { name: 'a', id: '001' },
  { name: 'b', id: '002' },
  { name: 'c', id: '003' },
  { name: 'd', id: '004' }
];
xo.findIndex(objArr, xo.partial(compare, '003')); // => 2
```

####flatten

Takes an n-dimensional nested array. Returns a flattened 1-dimension array.

```javascript
var test = [0, 1, [2, 3], [4, [5, 6]], 7, [8, [9]]];
xo.flatten(test); // => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
```

####compact

Takes an array. Returns an array with all falsy values removed.

```javascript
var test = [1, , false, 2, 3, false];
xo.compact(test); // => [1, 2, 3]
```

####memoize

Takes a function and returns a functions. Invoking the returned function will return cached results if the same arguments have been provided during previous invocations.

```javascript
var upper = function(str) {
  return str.toUpperCase();
};
var memoUpper = xo.memoize(upper);
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
var sum = function(a, b) {
  return a + b;
}
var maybeSum = xo.maybe(sum);
maybeSum(2, 3); // => 5
maybeSum(null, 3); // doesn't invoke sum
```


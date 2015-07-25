(function () {
  "use strict";
  var root = this,
    previous_xo = root.xo,
    xo;

  xo = {
    VERSION: '0.0.1',
    noConflict: noConflict,
    memoize: memoize,
    flatten: flatten,
    compact: compact,
    partial: partial,
    findIndex: findIndex
  };

  function noConflict() {
    root.xo = previous_xo;
    return xo;
  }

  function partial(fn) {
    var initialArgs = Array.prototype.slice.call(arguments, 1);
    return function() {
      var remainingArgs = Array.prototype.slice.call(arguments);
      return fn.apply(this, initialArgs.concat(remainingArgs));
    };
  }

  function flatten(arr) {
    var output = [];
    arr.forEach(function(val) {
      output = output.concat(Array.isArray(val) ? flatten(val) : val);
    });
    return output;
  }

  function filter() {
    // stub
  }

  function compact(arr) {
    return arr.reduce(function(memo, val) {
      return val ? memo.concat(val) : memo;
    }, []);
  }

  function findIndex(arr, predicate) {
    var idx,
      len;
    for (idx = 0, len = arr.length; idx < len; idx += 1) {
      if (predicate(arr[idx])) {
        return idx;
      }
    }
    return -1;
  }

  function memoize(fn) {
    var cache = {};
    return function() {
      var key = JSON.stringify(arguments);
      return cache[key] || (cache[key] = fn.apply(this, arguments));
    };
  }

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = xo;
    }
    exports.xo = xo;
  } else {
    root.xo = xo;
  }

}).call(this);

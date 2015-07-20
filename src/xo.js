(function () {
  "use strict";
  var root = this,
    previous_xo = root.xo,
    xo;

  function noConflict() {
    root.xo = previous_xo;
    return xo;
  }

  function partial() {
    // stub
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

  function findIndex() {
    // stub
  }

  function memoize(fn) {
    var cache = {};
    return function() {
      var key = JSON.stringify(arguments);
      return cache[key] || (cache[key] = fn.apply(this, arguments));
    };
  }

  xo = {
    VERSION: '0.0.1',
    noConflict: noConflict,
    memoize: memoize,
    flatten: flatten,
    compact: compact
  };

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = xo;
    }
    exports.xo = xo;
  } else {
    root.xo = xo;
  }

}).call(this);

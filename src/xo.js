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

  function flatten() {
    // stub
  }

  function filter() {
    // stub
  }

  function compact() {
    // stub
  }

  function findIndex() {
    // stub
  }

  function memoize() {
    // stub
  }

  xo = {
    VERSION: '0.0.1',
    noConflict: noConflict
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

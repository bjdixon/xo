(function () {
  "use strict";
  var root = this,
    previous_xo = root.xo,
    xo;

  function noConflict() {
    root.xo = previous_xo;
    return xo;
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

(function () {
  "use strict";
  var root = this;
  var previous_xo = root.xo;

  var xo = function () {
    // module code goes here
  };

  xo.noConflict = function () {
    root.xo = previous_xo;
    return xo;
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

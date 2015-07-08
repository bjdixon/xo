if(typeof xo === 'undefined') {
  var xo = require('..');
}

describe('xo', function(){
  it('returns correct version number', function(){
    expect(xo.VERSION).toBe('0.0.1');
  });
});


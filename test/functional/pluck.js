require('amdefine/intercept');

var pluck = require('../../src/functional/pluck');

describe('Functional#pluck', function() {
    it('should extract value from object', function() {
        pluck('a', {a: 1, b: 2}).should.be.eql(1);
    });
    it('should extract value from nested object', function() {
        pluck('b.c', {a: 1, b: {c: 'c'}}).should.be.eql('c');
    });
    it('should extract value from array', function() {
        pluck(1, ['a', 'b']).should.be.eql('b');
    });
    it('should extract value from nested array', function() {
        pluck('1.1.0', ['a', ['b', ['c']]]).should.be.eql('c');
    });
    it('should return default value is cant be found', function() {
        pluck('99999', ['a', ['b', ['c']]], 'fallback').should.be.eql('fallback');
    });
    it('should return inherited properties', function() {
        pluck('toString', {}).should.be.type('function');
    });
});

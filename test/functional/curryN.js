require('amdefine/intercept');

var curryN = require('../../src/functional/curryN');
function testFn() {
    return Array.prototype.slice.call(arguments);
}

describe('Functional#curryN', function() {
    it('should return funciton', function() {
        curryN(1, testFn).should.be.type('function')
    });
    it('should curry function with arity 1', function() {
        curryN(1, testFn)('a').should.be.eql(['a']);
    });
    it('should curry function with arity 1, but apply all given arguments', function() {
        curryN(1, testFn)('a', 'b').should.be.eql(['a', 'b']);
    });
    it('should curry function with arity 1 and apply context', function() {
        curryN(1, function() {
            return this.a;
        }, {a: 1})('a', 'b').should.be.eql(1);
    });
});

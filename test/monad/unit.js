require('amdefine/intercept');

var unit = require('../../src/monad/unit');

var mAddOne = function(v) {
    return unit(v + 1);
};

var mAddTwo = function(v) {
    return unit(v + 2);
};

var unWrap = function(v) { return v; };

describe('monad/unit', function() {
    describe('obey monads axioms', function() {
        it('it should fulfil left identity - first law', function() {
            var right = unit(1).bind(mAddOne);
            var left = mAddOne(1);

            right.bind(unWrap).should.be.eql(left.bind(unWrap))
        });
        it('it should fulfil right identity - second law', function() {
            var right = unit(1).bind(unit);
            var left = unit(1);

            right.bind(unWrap).should.be.eql(left.bind(unWrap))
        });
        it('it should fulfil associative identity - third law', function() {
            var right = unit(1).bind(mAddOne).bind(mAddTwo);
            var left = unit(1).bind(function(x) {
                return mAddOne(x).bind(mAddTwo)
            });

            right.bind(unWrap).should.be.eql(left.bind(unWrap))
        });
    });
});

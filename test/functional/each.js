require('amdefine/intercept');

var each = require('../../src/functional/each');

describe('Functional#each', function() {
    it('should loop through array', function() {
        var looped = 0;
        each([1, 2, 3], function() {
            looped++;
        });
        looped.should.be.eql(3);
    });
    it('should loop through object', function() {
        var looped = 0;
        var data = {a: [1, 2, 3], b: {c: 1}, d: []};
        each(data, function(i) {
            looped++;
        });
        looped.should.be.eql(3);
    });
    it('should allow to loop on array like objects', function() {
        var list = function() {
            var looped = 0;
            each(arguments, function() {
                ++looped;
            });
            return looped;
        };

        list(1, 2, 3, 4).should.be.eql(4);
    });
    it('should embrace native implementation', function() {
        var native = false;

        each({
            forEach: function() {
                native = true;
            }
        });

        native.should.be.true;
    });
    it('should iterate manually', function() {
        var called = 0;
        each({forEach: 'r', a: 1, b: 2, c: 3}, function() {
            called++;
        });

        called.should.be.eql(4);
    });
});

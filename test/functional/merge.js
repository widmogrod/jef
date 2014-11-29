require('amdefine/intercept');

var merge = require('../../src/functional/merge');

describe('Functional', function() {
    describe('#merge', function() {
        it('should merge flat objects', function() {
            var a = {a:1, c:2};
            var b = {b:1, c:3};

            merge(a, b).should.be.eql({
                a: 1, b:1, c:3
            });
        });
        it('should merge deep objects recursively', function() {
            var a = {a:1, c:{d:1, e:{f: 1}}};
            var b = {b:1, c:{d:2, e:{f: {g: 1}}}};

            merge(a, b).should.be.eql({
                a: 1, b:1, c:{d:2, e: {f: {g: 1}}}
            });
        });
    });
});

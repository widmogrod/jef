require('amdefine/intercept');

var List = require('../../src/immutable/list');

describe('Immutable#Lisst', function() {
    it('it should pass raw test', function() {
        var a = {a: 'a'},
            b = {b: 'b'},
            c = {c: 'c'},
            d = {d: 'd'},
            e = {e: 'e'},
            f = {f:'f'};

        var l1 = List([a, b, c, d, e]);

        l1.get(0).should.be.exactly(a);
        l1.get(1).should.be.exactly(b);

        var l2 = l1.set(1, f);

        l2.should.not.be.exactly(l1);
        l2.get(0).should.be.exactly(l1.get(0));
        l2.get(1).should.not.be.exactly(l1.get(1));
    });
});

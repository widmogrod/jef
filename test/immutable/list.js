require('amdefine/intercept');

var List = require('../../src/immutable/list');

describe('Immutable#Lisst', function() {
    var l1, a, b, c, d, e, f;

    beforeEach(function() {
        a = {a: 'a'};
        b = {b: 'b'};
        c = {c: 'c'};
        d = {d: 'd'};
        e = {e: 'e'};
        f = {f: 'f'};

        l1 = List.of(a, b, c, d, e);
    });

    it('should retrieve values by its key', function() {
        l1.get(0).should.be.exactly(a);
        l1.get(1).should.be.exactly(b);
        l1.get(2).should.be.exactly(c);
        l1.get(3).should.be.exactly(d);
        l1.get(4).should.be.exactly(e);
    });
    it('should create copy of a list when setting new value', function() {
        var l2 = l1.set(1, f);
        l2.should.be.an.instanceOf(List);
        l2.should.not.be.exactly(l1);
    });
    it('should have exactly the same new value in new copy and old in original', function() {
        var l2 = l1.set(0, f);

        l1.get(0).should.be.exactly(a);
        l2.get(0).should.not.be.exactly(l1.get(0));
    });
    it('should have unmodified values in copy for unaffected values', function() {
        var l2 = l1.set(0, f);
        l2.get(1).should.be.exactly(l1.get(1));
        l2.get(2).should.be.exactly(l1.get(2));
        l2.get(3).should.be.exactly(l1.get(3));
        l2.get(4).should.be.exactly(l1.get(4));
    })
});

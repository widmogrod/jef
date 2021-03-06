require('amdefine/intercept');

var Map = require('../../src/immutable/map');

describe('Immutable#Map', function() {
    var l1, a, b, c, d, e, f;

    beforeEach(function() {
        a = {a: 'a'};
        b = {b: 'b'};
        c = {c: 'c'};
        d = {d: 'd'};
        e = {e: 'e'};
        f = {f: 'f'};

        l1 = Map.fromNative([a, b, c, d, e]);
    });

    it('should retrieve values by its key', function() {
        l1.get(0).should.be.exactly(a);
        l1.get(1).should.be.exactly(b);
        l1.get(2).should.be.exactly(c);
        l1.get(3).should.be.exactly(d);
        l1.get(4).should.be.exactly(e);
    });
    it('should create copy of a Map when setting new value', function() {
        var l2 = l1.set(1, f);
        l2.should.be.an.instanceOf(Map);
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
    });

    it('should create copy of a Map when deleting key', function() {
        var l2 = l1.delete(0);
        l2.should.be.an.instanceOf(Map);
        l2.should.not.be.exactly(l1);
    });
    it('should not have deleted value', function() {
        var l2 = l1.delete(0);

        l1.has(0).should.be.true;
        l2.has(0).should.be.false;
        l1.get(0).should.be.exactly(a);
    });
    it('should have exactly the same values as in original except deleted one', function() {
        var l2 = l1.delete(0);

        l2.get(1).should.be.exactly(l1.get(1));
        l2.get(2).should.be.exactly(l1.get(2));
        l2.get(3).should.be.exactly(l1.get(3));
        l2.get(4).should.be.exactly(l1.get(4));
    });

    it('should set changes Map -> Map', function() {
        var l1 = Map.fromNative({
            a: Map.fromNative({
                b: Map.fromNative({
                    c: c,
                    d: d
                })
            })
        });

        var l2 = l1.setIn(['a', 'b', 'c'], e);

        l1.getIn(['a', 'b', 'c']).should.be.exactly(c);
        l2.getIn(['a', 'b', 'c']).should.be.exactly(e);

        // siblings should be the same
        l1.getIn(['a', 'b', 'd']).should.be.exactly(
            l2.getIn(['a', 'b', 'd'])
        );
        // but parents should change
        l1.getIn(['a', 'b']).should.not.be.exactly(
            l2.getIn(['a', 'b'])
        );

    });
    it('should set deep changes Map -> Map', function() {
        var l1 = Map.fromNative({
            a: {
                b: {
                    c: 1,
                    d: 3
                }
            }
        }, true);

        l1.should.be.an.instanceOf(Map);

        var l2 = l1.setIn(['a', 'b', 'c'], 2);

        l1.getIn(['a', 'b', 'c']).should.be.exactly(1);
        l2.getIn(['a', 'b', 'c']).should.be.exactly(2);

        // siblings should be the same
        l1.getIn(['a', 'b', 'd']).should.be.exactly(
            l2.getIn(['a', 'b', 'd'])
        );
        // but parents should change
        l1.getIn(['a', 'b']).should.not.be.exactly(
            l2.getIn(['a', 'b'])
        );
    });
    it('should work with bigger keys', function() {
        var l1 = Map.fromNative({
            abdef: a
        });

        l1.should.be.an.instanceOf(Map);
        l1.get('abdef').should.be.exactly(a);
    });

    describe('.forEach', function() {
        it('should return instance of Map', function() {
            var l2 = l1.forEach(function() {
            });
            l2.should.be.an.instanceOf(Map);
        });
        it('should be able to iterate', function() {
            var called = 0;
            l1.forEach(function() {
                ++called;
            });
            called.should.be.exactly(5)
        });
    });

    describe('.filter', function() {
        it('should return instance of Map', function() {
            var l2 = l1.filter(function(value) {
                return value !== a;
            });
            l2.should.be.an.instanceOf(Map);
        });
        it('should be able to filter', function() {
            var l2 = l1.filter(function(value) {
                return value === a;
            });

            var values = [];
            l2.forEach(function(value) {
                values.push(value);
            });

            values.should.be.eql([a])
        });
    });

    describe('.map', function() {
        it('should return instance of Map', function() {
            var l2 = l1.map(function() {
                return a;
            });
            l2.should.be.an.instanceOf(Map);
        });
        it('should be able to map', function() {
            var l2 = l1.map(function() {
                return a;
            });

            var values = [];
            l2.forEach(function(value) {
                values.push(value);
            });

            values.should.be.eql([a, a, a, a, a])
        });
    });

    describe('.keys', function() {
        it('should return array', function() {
            l1.keys().should.be.array;
            l1.keys().should.be.eql([0, 1, 2, 3, 4]);
        });
        it('should update keys when update value', function() {
            var l2 = l1.set(0, f);
            l1.keys().should.be.eql([0, 1, 2, 3, 4]);
            l2.keys().should.be.eql([0, 1, 2, 3, 4]);
        });
        it('should update keys when set new value', function() {
            var l2 = l1.set('f', f);
            l1.keys().should.be.eql([0, 1, 2, 3, 4]);
            l2.keys().should.be.eql(['f', 0, 1, 2, 3, 4]);
        });
        it('should update keys when delete value', function() {
            var l2 = l1.delete(0);
            l1.keys().should.be.eql([0, 1, 2, 3, 4]);
            l2.keys().should.be.eql([1, 2, 3, 4]);
        });
    });
});

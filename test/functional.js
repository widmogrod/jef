var f = require('../functional.js');

describe('Functional', function(){
    describe('#is()', function(){
        it('should return false when the value is not Number', function(){
            f.is('Number', {}).should.not.be.ok;
            f.is('Number', []).should.not.be.ok;
        })
        it('should return true when the value is a Number', function(){
            f.is('Number', 111).should.be.ok;
            f.is('Number', new Number(123)).should.be.ok;
            f.is('Number', Number(123)).should.be.ok;
        })
    })
    describe('#isObject()', function(){
        it('should return false when the value is not an object', function(){
            f.isObject("1").should.not.be.ok;
            f.isObject([]).should.not.be.ok;
            f.isObject(1).should.not.be.ok;
        })
        it('should return true when the value is an object', function(){
            f.isObject({}).should.be.ok;
        })
    })
    describe('#slice()', function(){
        it('should return array when passed arguments', function(){
            (function(){
                return f.slice(arguments)
            })(1,2,3).should.be.Array
        })
        it('should return item in array when begin and end is passed', function(){
            [1,2,3].slice(-1).should.be.eql([3]);
            [1,2,3].slice(2).should.be.eql([3]);
            [1,2,3].slice(1).should.be.eql([2,3]);
            [1,2,3].slice(0, -1).should.be.eql([1, 2]);
            [1,2,3].slice(1, 2).should.be.eql([2]);

            f.slice([1,2,3], -1    ).should.be.eql([3]);
            f.slice([1,2,3],  2    ).should.be.eql([3]);
            f.slice([1,2,3],  1    ).should.be.eql([2,3]);
            f.slice([1,2,3],  0, -1).should.be.eql([1, 2]);
            f.slice([1,2,3],  1, 2).should.be.eql([2]);
        })
        it('should return null when splice on empty array', function(){
            [].slice(-1).should.be.eql([]);
            [].slice(2).should.be.eql([]);
            [].slice(0, -1).should.be.eql([]);

            f.slice([], -1    ).should.be.eql([]);
            f.slice([],  2    ).should.be.eql([]);
            f.slice([],  0, -1).should.be.eql([]);
        })
        it('should return null when splice on empty array', function(){
            [1].slice(-1).should.be.eql([1]);
            [1].slice(2).should.be.eql([]);
            [1].slice(0, -1).should.be.eql([]);

            f.slice([1], -1    ).should.be.eql([1]);
            f.slice([1],  2    ).should.be.eql([]);
            f.slice([1],  0, -1).should.be.eql([]);
        })
    })
    describe('#each()', function(){
        it('should loop through array', function(){
            var looped = 0;
            f.each([1, 2, 3], function(i) {
                looped++;
            })
            looped.should.be.eql(3);
        })
        it('should loop through object', function(){
            var looped = 0;
            var data = {a: [1,2,3], b: {c:1}, d:[]};
            f.each(data, function(i) {
                looped++;
            })
            looped.should.be.eql(3);
        })
    })
    describe('#map()', function(){
        var addOne = function(i) {return i + 1; };
        it('should return array', function(){
            f.map([1, 2, 3], addOne).should.be.Array;
        })
        it('should return array with values incremented by 1', function(){
            f.map([1, 2, 3], addOne).should.be.eql([2, 3, 4]);
        })
        it('should return array with values added', function(){
            f.map([1, 2, 3], [3, 4, 5], addOne).should.be.eql([[2, 3, 4],[4,5,6]]);
        })
    })
    describe('#traverse()', function(){
        var data;
        beforeEach(function(){
            data = [
                {
                    name: 'persons',
                    data: ['a','b','c','d'],
                    connections: [
                        {
                            name: 'distributed_person',
                            connections: [
                                {
                                    name: 'merging',
                                    data: [
                                        {
                                            '@ref': 'distriuted_relation'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    name: 'relation',
                    connections: [
                        {
                            name: 'distriuted_relation',
                        }
                    ]
                }
            ];
        })
        it('should traverse for every element', function(){
            var count = 0;
            f.traverse(data, function(item){
                ++count;
            });
            count.should.be.eql(21)
        })
        it('should traverse for each leaf', function(){
            var count = 0;
            f.traverse(data, function(item){
                if (this.isLeaf) {
                    ++count;
                }
            });
            count.should.be.eql(10)
        })
        it('should traverse for each children', function(){
            var count = 0;
            f.traverse(
                data,
                function(item){
                    ++count;
                },
                function(item, key) {
                    if (f.isArray(item)) {
                        return true;
                    }
                    if (f.isObject(item) && f.has('connections')(item)){
                        return f.get('connections')(item)
                    }
                }
            );
            count.should.be.eql(5);
        })
    })
    describe('#curry()', function(){
        it('should return function when function with zero argument is passed', function(){
            var result = f.curry(function(){});
            result.should.be.a('function');
        })
        it('should return function when function with one argument is passed', function(){
            var result = f.curry(function(a){ return a + 1 });
            result.should.be.a('function');
            result(1).should.be.eql(2);
        })
        it('should return function when function with two arguments is passed', function(){
            var result = f.curry(function(a, b){ return a + b });
            result.should.be.a('function');
            result(1,2).should.be.eql(3);
            result(1)(2).should.be.eql(3);
        })
        it('should return function when function with tree arguments is passed', function(){
            var result = f.curry(function(a, b, c){ return a + b + c });
            result.should.be.a('function');
            result(1, 2, 3).should.be.eql(6);
            result(1, 2)(3).should.be.eql(6);
            result(1)(2, 3).should.be.eql(6);
            result(1)(2)(3).should.be.eql(6);
        })
        it('should hold context of previous arguments', function(){
            var result = f.curry(function(a, b, c){ return a + b + c });
            result.should.be.a('function');

            var addOne = result(1);
            var addTwo = addOne(2);

            addTwo(3).should.be.eql(6);
            addTwo(4).should.be.eql(7);
        })
        it('should return array when function with one argument is passed', function(){
            var result = f.curry(function(a){ return a });
            result.should.be.a('function');
            result([1]).should.be.eql([1]);
            result([1,2]).should.be.eql([1,2]);
        })
    })
    describe('#compose()', function(){
        it('should return function with wrapped function', function(){
            var result = f.compose(function(a){
                return a;
            }, function(a) {
                return +a + 1;
            });

            result.should.be.a('function');
            result(2).should.be.eql(3);
        })
    })
    describe('#reduce()', function(){
        it('should return number when function with numeric base value is passed', function(){
            f.reduce([1, 2, 3], function(item, base) {
                return base + item;
            }, 0).should.be.eql(6);
        })
    })
    describe('#filter()', function(){
        it('should return filtered array when data and function are passed', function(){
            var result = f.filter([1, 2, 3], function(item) {
                return item <= 2;
            }, 0);

            result.should.be.Array;
            result.should.be.eql([1, 2]);
        })
    })
    describe('#flip()', function(){
        it('should return function that accept arguments in reversed order', function(){
            var funcReturnSecond = function(a,b) {return b};
            funcReturnSecond('a', 'b').should.be.eql('b');
            f.flip(funcReturnSecond)('a', 'b').should.be.eql('a');
        })
    })
    describe('#get()', function(){
        it('should return function when arguments is passed', function(){
            var func = f.get('name');
            func.should.be.a('function');
        })
        it('should return value when arguments is passed and function is invoked on object', function(){
            var obj = {name: 'test'};
            var func = f.get('name');
            func(obj).should.be.eql('test');
        })
    })
    describe('#fill()', function(){
        it('should return data filled with value n-times', function(){
            f.fill(1, 2).should.be.eql([1,1]);
            f.fill(1, 2, ['a', 'b']).should.be.eql(['a', 'b', 1,1]);
        })
    })
    describe('#maybe()', function(){
        it('should return result of function when arguments are not null or undefined', function(){
            var returnValue = function(a) {return a};
            f.maybe(0, returnValue).should.be.eql(0);
            f.maybe({}, returnValue).should.be.eql({});
        })
        it('should return not execute function when arguments are null or undefined', function(){
            var returnValue = function(a) { should.fail('can\'t call function ')};
            f.maybe(null, returnValue);
            f.maybe(undefined, returnValue);
        })
    })
    describe('#transpose()', function(){
        it('should return array if not type of array is passed', function(){
            f.transpose(2).should.be.eql([2]);
        })
        it('should return array single array is passed', function(){
            f.transpose([2]).should.be.eql([[2]]);
        })
        it('should return transposed array if array is passed', function(){
            f.transpose(['a', 'b', 'c']).should.be.eql([['a'],['b'],['c']]);
            f.transpose([['a', 'b', 'c'], ['x', 'y', 'z']]).should.be.eql([['a','x'],['b','y'],['c','z']]);
        })
        it('should return transposed array with modified mapped values if array and callback is passed', function(){
            var callback = function(a) {
                return a + ':' + a;
            };
            f.transpose(['a', 'b', 'c'], callback).should.be.eql([['a:a'],['b:b'],['c:c']]);
            f.transpose([['a', 'b', 'c'], ['x', 'y', 'z']], callback).should.be.eql([['a:a','x:x'],['b:b','y:y'],['c:c','z:z']]);
        })
    })
    describe('#apply()', function(){
        var func = function sum(a, b) { return a + b };
        it('should return result of a function', function(){
            f.apply(func, [1,2]).should.be.eql(3);
        })
        it('should return array of results of a function if more that one argument is passed', function(){
            f.apply(func, [1,2], [3,4]).should.be.eql([3, 7]);
        })
        it('should allow inception and return arguments', function(){
            f.apply(f.apply, [func, [1,2]]).should.be.eql(3);
            f.apply(f.apply, [func, [1,2], [3,4]]).should.be.eql([3, 7]);
        })
    })
    describe('#invoke()', function(){
        var data = [[5,3,2], [4,4,2], [1,2,3]];
        it('should invoke method on each element of the list', function(){
            f.invoke(data, 'sort').should.be.eql([[2,3,5],[2,4,4],[1,2,3]]);
        })
    })
    describe('#applyc()', function(){
        it('should invoke and return array', function(){
            var func = function(a, b) { return a * b }
            f.applyc(func, [2], [2]).should.be.eql([4]);
        })
        it('should invoke and return array', function(){
            var func = function(a, b) { return a * b }
            f.applyc(func, [2,3], [4,5]).should.be.eql([8, 15]);
        })
    })
    describe('#memoize()', function(){
        it('should invoke cached function end return value', function(){
            var test = 0;
            var func = f.memoize(function() {
                test += 1;
                return test;
            });
            func.should.be.a('function');
            func().should.be.eql(1);
            func().should.be.eql(1);
        })
        it('should invoke cached function end return value if more complex arguments are passed', function(){
            var test = 0;
            var func = f.memoize(function(a,b,c) {
                test += 1;
                return test;
            });
            func.should.be.a('function');
            func(null, [1,2,[3]], {test: function(){}}).should.be.eql(1);
            func(null, [1,2,[3]], {test: function(){}}).should.be.eql(1);
        })
    })
});

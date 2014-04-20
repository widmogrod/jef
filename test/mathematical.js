var m = require('../mathematical.js');

describe('Mathematical', function(){
    describe('#addition()', function(){
        it('should return result of operation if argument are passed', function(){
            m.addition(1, 2).should.be.eql(3);
            m.addition(11, 22).should.be.eql(33);
            m.addition(11, 22, 10).should.be.eql(43);
        })
    })
    describe('#subtraction()', function(){
        it('should return result of operation if argument are passed', function(){
            m.subtraction(1, 2).should.be.eql(-1);
            m.subtraction(11, 22).should.be.eql(-11);
            m.subtraction(11, 22, 10).should.be.eql(-21);
        })
    })
    describe('#multiplication()', function(){
        it('should return result of operation if argument are passed', function(){
            m.multiplication(1, 2).should.be.eql(2);
            m.multiplication(10, 22).should.be.eql(220);
            m.multiplication(10, 22, 10).should.be.eql(2200);
        })
    })
    describe('#division()', function(){
        it('should return result of operation if argument are passed', function(){
            m.division(1, 2).should.be.eql(0.5);
            m.division(10, 2).should.be.eql(5);
            m.division(10, 5, 2).should.be.eql(1);
        })
    })
    describe('#equal()', function(){
        it('should return result of operation if argument are passed', function(){
            m.equal(1,2).should.be.eql(false);
            m.equal(10,10).should.be.eql(true);
        })
    })
    describe('#summation()', function(){
        it('should return result of operation if argument are passed', function(){
            m.summation([1,2]).should.be.eql(3);
            m.summation([10,10,1]).should.be.eql(21);
        })
        it('should return result of summation callback is passed', function(){
            var func = function(i) { return i + 1};
            m.summation([1,2], func).should.be.eql(5);
            m.summation([10,10,1], func).should.be.eql(24);
        })
    })
});
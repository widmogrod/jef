require('amdefine/intercept');

var domdiff = require('../src/domdiff/diff');
var applyDiff = require('../src/domdiff/applyDiff');
var nodeSame = require('../src/domdiff/nodeSame');
var nodeLeaf = require('../src/domdiff/nodeLeaf');
var nodeExactly = require('../src/domdiff/nodeExactly');
var attrDifference = require('../src/domdiff/attrDifference');
var attrIntersection = require('../src/domdiff/attrIntersection');
var NamespaceString = require('../src/domdiff/NamespaceString');
var NamespaceNext = require('../src/domdiff/NamespaceNext');
var jsdom = require("jsdom").jsdom;
var document = jsdom("<html><head></head><body>hello world</body></html>");
var window = document.parentWindow;
var elementOne, elementTwo, result, next, elementTwoContext;

function execute(a, b, diff) {
    applyDiff(a, b, diff);
    return a.innerHTML;
}

describe('DomDiff', function() {
    beforeEach(function() {
        elementOne = document.createElement('div');
        elementTwo = document.createElement('div');
    });

    describe('#diff', function(){
        it('should return string', function(){
            domdiff(elementOne, elementTwo).should.be.string;
        })
        it('should replace elements', function() {
            elementOne.innerHTML = '<ul><li>First element</li></ul>';
            elementTwo.innerHTML = '<ul><li>Second element</li></ul>';
            result = domdiff(elementOne, elementTwo);
            result.should.be.eql(
                'aElement.childNodes[0].childNodes[0].replaceChild(bElement.childNodes[0].childNodes[0].childNodes[0], aElement.childNodes[0].childNodes[0].childNodes[0]);\n'
            );
            execute(elementOne, elementTwo, result).should.be.eql(
                '<ul><li>Second element</li></ul>'
            );
        });
        it('should replace elements if not same', function() {
            elementOne.innerHTML = '<div><b>a</b><p>First element</p><div></div></div>';
            elementTwo.innerHTML = '<div><i>a</i><p>First element</p><div><b>test</b></div></div>';
            result = domdiff(elementOne, elementTwo);
            result.should.be.eql(
                'aElement.childNodes[0].replaceChild(bElement.childNodes[0].childNodes[0], aElement.childNodes[0].childNodes[0]);\naElement.childNodes[0].childNodes[2].appendChild(bElement.childNodes[0].childNodes[1].childNodes[0]);\n'
            );
            execute(elementOne, elementTwo, result).should.be.eql(
                '<div><i>a</i><p>First element</p><div><b>test</b></div></div>'
            );
        });
        it('should replace elements if not same 2', function() {
            elementOne.innerHTML = '<ul><li><b>guest</b><span></span><p>another node</p></li>'+
                                       '<li><b>guest</b><span>a</span></li></ul>';
            elementTwo.innerHTML = '<ul><li><b>guest</b><span></span></li>'+
                                       '<li><b>guest</b><span>a</span><p>another node</p></li>'+
                                       '<li><b>guest</b><span>b</span></li></ul>';
            result = domdiff(elementOne, elementTwo);
            result.should.be.eql(
                'aElement.childNodes[0].childNodes[0].removeChild(aElement.childNodes[0].childNodes[0].childNodes[2]);\naElement.childNodes[0].childNodes[1].appendChild(bElement.childNodes[0].childNodes[1].childNodes[2]);\naElement.childNodes[0].appendChild(bElement.childNodes[0].childNodes[2]);\n'
            );
            execute(elementOne, elementTwo, result).should.be.eql(
                '<ul><li><b>guest</b><span></span></li>'+
                '<li><b>guest</b><span>a</span><p>another node</p></li>'+
                '<li><b>guest</b><span>b</span></li></ul>'
            );
        });
        it('should replace arguments', function() {
            elementOne.innerHTML = '<ul><li class="a">First element</li></ul>';
            elementTwo.innerHTML = '<ul><li class="b">First element</li></ul>';
            result = domdiff(elementOne, elementTwo);
            result.should.be.eql(
                'aElement.childNodes[0].childNodes[0].setAttribute(\"class\", bElement.childNodes[0].childNodes[0].getAttribute(\"class\"));\n'
            );
            execute(elementOne, elementTwo, result).should.be.eql(
                '<ul><li class="b">First element</li></ul>'
            );
        });
        it('should add arguments', function() {
            elementOne.innerHTML = '<ul><li>First element</li></ul>';
            elementTwo.innerHTML = '<ul><li class="b">First element</li></ul>';
            result = domdiff(elementOne, elementTwo);
            result.should.be.eql(
                'aElement.childNodes[0].childNodes[0].setAttribute(\"class\", bElement.childNodes[0].childNodes[0].getAttribute(\"class\"));\n'
            );
            execute(elementOne, elementTwo, result).should.be.eql(
                '<ul><li class="b">First element</li></ul>'
            );
        });
        it('should remove arguments', function() {
            elementOne.innerHTML = '<ul><li class="a">First element</li></ul>';
            elementTwo.innerHTML = '<ul><li>First element</li></ul>';
            result = domdiff(elementOne, elementTwo);
            result.should.be.eql(
                'aElement.childNodes[0].childNodes[0].removeAttribute(\"class\");\n'
            );
            execute(elementOne, elementTwo, result).should.be.eql(
                '<ul><li>First element</li></ul>'
            );
        });
        it('should add boolean argument', function() {
            elementOne.innerHTML = '<ul><li>First element</li></ul>';
            elementTwo.innerHTML = '<ul><li disabled>First element</li></ul>';
            result = domdiff(elementOne, elementTwo);
            result.should.be.eql(
                'aElement.childNodes[0].childNodes[0].setAttribute("disabled", bElement.childNodes[0].childNodes[0].getAttribute("disabled"));\n'
            );
            execute(elementOne, elementTwo, result).should.be.eql(
                '<ul><li disabled="">First element</li></ul>'
            );
        });
        it('should replace boolean argument', function() {
            elementOne.innerHTML = '<ul><li disabled>First element</li></ul>';
            elementTwo.innerHTML = '<ul><li required>First element</li></ul>';
            result = domdiff(elementOne, elementTwo);
            result.should.be.eql(
                'aElement.childNodes[0].childNodes[0].removeAttribute("disabled");\n'+
                'aElement.childNodes[0].childNodes[0].setAttribute("required", bElement.childNodes[0].childNodes[0].getAttribute("required"));\n'
            );
            execute(elementOne, elementTwo, result).should.be.eql(
                '<ul><li required="">First element</li></ul>'
            );
        });
        it('should remove boolean argument', function() {
            elementOne.innerHTML = '<ul><li disabled>First element</li></ul>';
            elementTwo.innerHTML = '<ul><li>First element</li></ul>';
            result = domdiff(elementOne, elementTwo);
            result.should.be.eql(
                'aElement.childNodes[0].childNodes[0].removeAttribute("disabled");\n'
            );
            execute(elementOne, elementTwo, result).should.be.eql(
                '<ul><li>First element</li></ul>'
            );
        });
        it('should remove argument not in child', function() {
            elementOne.innerHTML = '<ul class="active"><li>First element</li></ul>';
            elementTwo.innerHTML = '<ul class="inactive"><li>First element</li></ul>';
            result = domdiff(elementOne, elementTwo);
            result.should.be.eql(
                'aElement.childNodes[0].setAttribute("class", bElement.childNodes[0].getAttribute("class"));\n'
            );
            execute(elementOne, elementTwo, result).should.be.eql(
                '<ul class="inactive"><li>First element</li></ul>'
            );
        });
        it('should remove unused elements', function() {
            elementOne.innerHTML = '<ul><li>First element</li><li>Second element</li></ul>';
            elementTwo.innerHTML = '<ul><li>First element</li></ul>';
            result = domdiff(elementOne, elementTwo);
            result.should.be.eql(
                'aElement.childNodes[0].removeChild(aElement.childNodes[0].childNodes[1]);\n'
            );
            execute(elementOne, elementTwo, result).should.be.eql(
                '<ul><li>First element</li></ul>'
            );
        });
        it('should add new elements', function() {
            elementOne.innerHTML = '<ul><li>First element</li></ul>';
            elementTwo.innerHTML = '<ul><li>First element</li><li>Second element</li></ul>';
            result = domdiff(elementOne, elementTwo);
            result.should.be.eql(
                'aElement.childNodes[0].appendChild(bElement.childNodes[0].childNodes[1]);\n'
            );
            execute(elementOne, elementTwo, result).should.be.eql(
                '<ul><li>First element</li><li>Second element</li></ul>'
            );
        });
        it('should replace elements', function() {
            elementOne.innerHTML = '<div><b>First element</b></div>';
            elementTwo.innerHTML = '<div><span>First element</span></div>';
            result = domdiff(elementOne, elementTwo);
            result.should.be.eql(
                'aElement.childNodes[0].replaceChild(bElement.childNodes[0].childNodes[0], aElement.childNodes[0].childNodes[0]);\n'
            );
            execute(elementOne, elementTwo, result).should.be.eql(
                '<div><span>First element</span></div>'
            );
        });
        it('should replace elements 3', function() {
            elementOne.innerHTML = '<table><tbody><tr><td colspan="2"><span>A</span>Yes</td></tr></tbody></table>';
            elementTwo.innerHTML = '<table><tbody><tr><td><select name="test"><option value="1">value</option></select></td><td><input type="number"></td></tr></tbody></table>';
            result = domdiff(elementOne, elementTwo);
            result.should.be.eql(
                'aElement.childNodes[0].childNodes[0].childNodes[0].childNodes[0].removeAttribute(\"colspan\");\naElement.childNodes[0].childNodes[0].childNodes[0].childNodes[0].replaceChild(bElement.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0], aElement.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0]);\naElement.childNodes[0].childNodes[0].childNodes[0].childNodes[0].removeChild(aElement.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1]);\naElement.childNodes[0].childNodes[0].childNodes[0].appendChild(bElement.childNodes[0].childNodes[0].childNodes[0].childNodes[1]);\n'
            );
            execute(elementOne, elementTwo, result).should.be.eql(
                '<table><tbody><tr><td><select name="test"><option value="1">value</option></select></td><td><input type="number"></td></tr></tbody></table>'
            );
        });
    })
    describe('#attrDifference', function() {
        it('should find diff with mixed', function() {
            elementOne.className = 'test';
            attrDifference(
                elementOne.attributes,
                ['test']
            ).should.be.eql(['class']);
        });
        it('should not find diff with mixed', function() {
            elementOne.className = 'test';
            attrDifference(
                elementOne.attributes,
                ['class']
            ).should.be.eql([]);
        });
    });
    describe('#attrIntersection', function() {
        it('should not have intersection', function() {
            elementOne.attributes['class'] = 'test';
            elementTwo.attributes['id'] = 'id';
            attrIntersection(
                elementOne.attributes,
                elementTwo.attributes
            ).should.be.eql([]);
        });
        it('should have intersection', function() {
            elementOne.className = 'test';
            elementTwo.className = 'test2';
            attrIntersection(
                elementOne.attributes,
                elementTwo.attributes
            ).should.be.eql(['class']);
        });
    });
    describe('#nodeExactly', function() {
        it('should be exacly', function() {
            elementOne.textContent = 'asd';
            elementTwo.textContent = 'asd';
            nodeExactly(
                elementOne,
                elementTwo
            ).should.be.true;
        });
        it('should not be exacly', function() {
            elementOne.textContent = 'asd2';
            elementTwo.textContent = 'asd';
            nodeExactly(
                elementOne,
                elementTwo
            ).should.be.false;
        });
    });
    describe('node manipulations', function() {
        beforeEach(function() {
            document.body.innerHTML = '';
            elementOne = document.createElement('div');
            document.body.appendChild(elementOne);
            elementTwo = document.createElement('div');
            elementTwoContext = document.createElement('div');
            elementTwoContext.appendChild(elementTwo);
        });

        it('should have valid reference', function() {
            elementOne.should.be.exactly(
                document.childNodes[0].childNodes[1].childNodes[0]
            );
            elementTwo.should.be.exactly(
                elementTwoContext.childNodes[0]
            );
        })

        describe('#nodeSame', function() {
           it('node should be the same', function() {
              nodeSame(
                  elementOne,
                  elementTwo
              ).should.be.true;
           });
        });
        describe('#nodeExactly', function() {
           it('node should be excatly', function() {
              nodeExactly(
                  elementOne,
                  elementTwo
              ).should.be.true;
           });
           it('node should not be excatly', function() {
              nodeExactly(
                  document.createTextNode('ccc'),
                  document.createTextNode('asd')
              ).should.be.false;
           });
        });
        describe('#nodeLeaf', function() {
           it('should return true', function() {
              nodeLeaf(
                  elementOne,
                  elementTwo
              ).should.be.true;
           });
           it('should return false', function() {
              nodeLeaf(
                  elementOne,
                  elementTwoContext
              ).should.be.false;
           });
        });
    });
    describe('#NamespaceString', function() {
        beforeEach(function() {
            result = new NamespaceString('test');
        });
        it('should have string representation', function() {
            result.toString().should.be.string
            result.toString().should.be.eql('test');
        });
        it('should return parent', function() {
            result.parent().should.be.eql(result);
            result.parent().toString().should.be.eql('test');
        });
        describe('#next', function() {
            it('should return next', function() {
                result.next().should.be.an.instanceOf(NamespaceNext);
            });
            it('should return next with valid parent reference', function() {
                result.next().parent().should.be.eql(result);
                result.next().parent().toString().should.be.eql(result.toString());
            });
            it('should return next namespace and have valid string representation', function() {
                result.next().toString().should.be.eql('test.childNodes[0]');
            });
            it('should return next on specific index', function() {
               result.next(2).toString().should.be.eql('test.childNodes[2]');
            });
            it('should return next and after pop have valid string representation', function() {
                result.next(2).pop().toString().should.be.eql('test.childNodes[1]');
            });
            it('should return next and after push have valid string representation', function() {
                result.next(2).push().toString().should.be.eql('test.childNodes[3]');
            });
            it('should pop from parent', function() {
                next = result.next();
                next.push();
                next.toString().should.be.eql('test.childNodes[1]');

                result = next.next(4);

                result.toString().should.be.eql('test.childNodes[1].childNodes[4]');
                result.parent().pop();
                result.toString().should.be.eql('test.childNodes[0].childNodes[4]')
                result.parent().push();
                result.toString().should.be.eql('test.childNodes[1].childNodes[4]')
            });
            it('pop and push should give same result', function() {
               next = result.next(2);
               next.pop();
               next.toString().should.be.eql('test.childNodes[1]');
               next.push();
               next.toString().should.be.eql('test.childNodes[2]');
            });
        });
    });
});

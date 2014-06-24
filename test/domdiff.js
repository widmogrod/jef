var domdiff = require('../domdiff.js');
var jsdom = require("jsdom").jsdom;
var document = jsdom("<html><head></head><body>hello world</body></html>");
var window = document.parentWindow;
var elementOne, elementTwo, result, next, elementTwoContext;

describe('DomDiff', function() {
    beforeEach(function() {
        elementOne = document.createElement('div');
        elementTwo = document.createElement('div');
    });

    describe('#diff', function(){
        it('should return string', function(){
            domdiff.diff(elementOne, elementTwo).should.be.string;
        })
        it('should replace elements', function() {
            elementOne.innerHTML = '<ul><li>First element</li></ul>';
            elementTwo.innerHTML = '<ul><li>Second element</li></ul>';
            domdiff.diff(elementOne, elementTwo).should.be.eql(
                'aElement.children[0].replaceChild(bElement.children[0].children[0], aElement.children[0].children[0]);\n'
            );
        });
        it('should replace elements if not same', function() {
            elementOne.innerHTML = '<div><b>a</b><p>First element</p><div></div></div>';
            elementTwo.innerHTML = '<div><i>a</i><p>First element</p><div><b>test</b></div></div>';
            domdiff.diff(elementOne, elementTwo).should.be.eql(
                'aElement.children[0].replaceChild(bElement.children[0].children[0], aElement.children[0].children[0]);\n'+
                'aElement.children[0].children[1].appendChild(bElement.children[0].children[1].children[0]);\n'
            );
        });
        it('should replace arguments', function() {
            elementOne.innerHTML = '<ul><li class="a">First element</li></ul>';
            elementTwo.innerHTML = '<ul><li class="b">First element</li></ul>';
            domdiff.diff(elementOne, elementTwo).should.be.eql(
                'aElement.children[0].children[0].setAttribute("class", bElement.children[0].children[0].getAttribute("class"));\n'
            );
        });
        it('should add arguments', function() {
            elementOne.innerHTML = '<ul><li>First element</li></ul>';
            elementTwo.innerHTML = '<ul><li class="b">First element</li></ul>';
            domdiff.diff(elementOne, elementTwo).should.be.eql(
                'aElement.children[0].children[0].setAttribute("class", bElement.children[0].children[0].getAttribute("class"));\n'
            );
        });
        it('should remove arguments', function() {
            elementOne.innerHTML = '<ul><li class="a">First element</li></ul>';
            elementTwo.innerHTML = '<ul><li>First element</li></ul>';
            domdiff.diff(elementOne, elementTwo).should.be.eql(
                'aElement.children[0].children[0].removeAttribute("class");\n'
            );
        });
        it('should add boolean argument', function() {
            elementOne.innerHTML = '<ul><li>First element</li></ul>';
            elementTwo.innerHTML = '<ul><li disabled>First element</li></ul>';
            domdiff.diff(elementOne, elementTwo).should.be.eql(
                'aElement.children[0].children[0].setAttribute("disabled", bElement.children[0].children[0].getAttribute("disabled"));\n'
            );
        });
        it('should replace boolean argument', function() {
            elementOne.innerHTML = '<ul><li disabled>First element</li></ul>';
            elementTwo.innerHTML = '<ul><li required>First element</li></ul>';
            domdiff.diff(elementOne, elementTwo).should.be.eql(
                'aElement.children[0].children[0].removeAttribute("disabled");\naElement.children[0].children[0].setAttribute("required", bElement.children[0].children[0].getAttribute("required"));\n'
            );
        });
        it('should remove boolean argument', function() {
            elementOne.innerHTML = '<ul><li disabled>First element</li></ul>';
            elementTwo.innerHTML = '<ul><li>First element</li></ul>';
            domdiff.diff(elementOne, elementTwo).should.be.eql(
                'aElement.children[0].children[0].removeAttribute("disabled");\n'
            );
        });
        it('should remove argument not in child', function() {
            elementOne.innerHTML = '<ul class="active"><li>First element</li></ul>';
            elementTwo.innerHTML = '<ul class="inactive"><li>First element</li></ul>';
            domdiff.diff(elementOne, elementTwo).should.be.eql(
                'aElement.children[0].setAttribute("class", bElement.children[0].getAttribute("class"));\n'
            );
        });
        it('should remove unused elements', function() {
            elementOne.innerHTML = '<ul><li>First element</li><li>Second element</li></ul>';
            elementTwo.innerHTML = '<ul><li>First element</li></ul>';
            domdiff.diff(elementOne, elementTwo).should.be.eql(
                'aElement.children[0].removeChild(aElement.children[0].children[1]);\n'
            );
        });
        it('should add new elements', function() {
            elementOne.innerHTML = '<ul><li>First element</li></ul>';
            elementTwo.innerHTML = '<ul><li>First element</li><li>Second element</li></ul>';
            domdiff.diff(elementOne, elementTwo).should.be.eql(
                'aElement.children[0].appendChild(bElement.children[0].children[1]);\n'
            );
        });
        it('should replace elements', function() {
            elementOne.innerHTML = '<div><b>First element</b></div>';
            elementTwo.innerHTML = '<div><span>First element</span></div>';
            domdiff.diff(elementOne, elementTwo).should.be.eql(
                'aElement.children[0].replaceChild(bElement.children[0].children[0], aElement.children[0].children[0]);\n'
            );
        });
    })
    describe('#attrDifference', function() {
        it('should find diff with mixed', function() {
            elementOne.className = 'test';
            domdiff.attrDifference(
                elementOne.attributes,
                ['test']
            ).should.be.eql(['class']);
        });
        it('should not find diff with mixed', function() {
            elementOne.className = 'test';
            domdiff.attrDifference(
                elementOne.attributes,
                ['class']
            ).should.be.eql([]);
        });
    });
    describe('#attrIntersection', function() {
        it('should not have intersection', function() {
            elementOne.attributes['class'] = 'test';
            elementTwo.attributes['id'] = 'id';
            domdiff.attrIntersection(
                elementOne.attributes,
                elementTwo.attributes
            ).should.be.eql([]);
        });
        it('should have intersection', function() {
            elementOne.className = 'test';
            elementTwo.className = 'test2';
            domdiff.attrIntersection(
                elementOne.attributes,
                elementTwo.attributes
            ).should.be.eql(['class']);
        });
    });
    describe('#nodeParentNamespace', function() {
        it('should return parent namespace part', function() {
            domdiff.nodeParentNamespace(
                "element.children[1].children[2]"
            ).should.be.eql(
                "element.children[1]"
            )
        });
    });
    describe('#nodeExactly', function() {
        it('should be exacly', function() {
            elementOne.textContent = 'asd';
            elementTwo.textContent = 'asd';
            domdiff.nodeExactly(
                elementOne,
                elementTwo
            ).should.be.true;
        });
        it('should not be exacly', function() {
            elementOne.textContent = 'asd2';
            elementTwo.textContent = 'asd';
            domdiff.nodeExactly(
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
                document.children[0].children[1].children[0]
            );
            elementTwo.should.be.exactly(
                elementTwoContext.children[0]
            );
        })

        describe('#nodeSame', function() {
           it('node should be the same', function() {
              domdiff.nodeSame(
                  elementOne,
                  elementTwo
              ).should.be.true;
           });
        });
        describe('#nodeExactly', function() {
           it('node should be excatly', function() {
              domdiff.nodeExactly(
                  elementOne,
                  elementTwo
              ).should.be.true;
           });
           it('node should not be excatly', function() {
              domdiff.nodeExactly(
                  document.createTextNode('ccc'),
                  document.createTextNode('asd')
              ).should.be.false;
           });
        });
        describe('#nodeLeaf', function() {
           it('should return true', function() {
              domdiff.nodeLeaf(
                  elementOne,
                  elementTwo
              ).should.be.true;
           });
           it('should return false', function() {
              domdiff.nodeLeaf(
                  elementOne,
                  elementTwoContext
              ).should.be.false;
           });
        });
        describe('#nodePosition', function() {
            it('should retrieve node position', function() {
                domdiff.nodePosition(elementOne).should.be.eql(0);
                domdiff.nodePosition(elementTwo).should.be.eql(0);
            });
        });
        describe('#nodeRetrievePath', function() {
            it('should retrieve element document path', function() {
                result = domdiff.nodeRetrievePath(elementOne) ;
                result.should.be.eql(
                    'document.children[0].children[1].children[0]'
                );
            });
            it('should retrieve element path to specific element', function() {
                result = domdiff.nodeRetrievePath(elementOne, 'element', document.children[0]) ;
                result.should.be.eql(
                    'element.children[1].children[0]'
                );
            });
            it('should retrieve element memory path', function() {
                result = domdiff.nodeRetrievePath(elementTwo, 'element') ;
                result.should.be.eql(
                    'element.children[0]'
                );
            });
        });
    });
    describe('#NamespaceString', function() {
        beforeEach(function() {
            result = new domdiff.NamespaceString('test');
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
                result.next().should.be.an.instanceOf(domdiff.NamespaceNext);
            });
            it('should return next with valid parent reference', function() {
                result.next().parent().should.be.eql(result);
                result.next().parent().toString().should.be.eql(result.toString());
            });
            it('should return next namespace and have valid string representation', function() {
                result.next().toString().should.be.eql('test.children[0]');
            });
            it('should return next on specific index', function() {
               result.next(2).toString().should.be.eql('test.children[2]');
            });
            it('should return next and after pop have valid string representation', function() {
                result.next(2).pop().toString().should.be.eql('test.children[1]');
            });
            it('should return next and after push have valid string representation', function() {
                result.next(2).push().toString().should.be.eql('test.children[3]');
            });
            it('should pop from parent', function() {
                next = result.next();
                next.push();
                next.toString().should.be.eql('test.children[1]');

                result = next.next(4);

                result.toString().should.be.eql('test.children[1].children[4]');
                result.parent().pop();
                result.toString().should.be.eql('test.children[0].children[4]')
            });
        });
    });
})

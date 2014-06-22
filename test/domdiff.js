var domdiff = require('../domdiff.js');
var jsdom = require("jsdom").jsdom;
var document = jsdom("<html><head></head><body>hello world</body></html>");
var window = document.parentWindow;
var _ = require('lodash');
var template = _.template('<ul>'+
     '<% _.each(rows, function(row) { %>'+
     '<li><%= row.name %></li>'+
     '<% }); %>'+
   '</ul>');

var dataA = {
  rows:[
    {name: "Adam"}
  ]
};
var dataB = {
  rows:[
    {name: "Adam"},
    {name: "Barbara"},
    {name: "John"}
  ]
};
var tmplA = template(dataA);
var tmplB = template(dataB);
var refA, refB, elementOne, elementTwo, result;
var elementTwoContext;

describe('DomDiff', function() {
    beforeEach(function() {
        refA = document.createElement('div');
        refA.innerHTML = tmplA;
        refB = document.createElement('div');
        refB.innerHTML = tmplB;
    });

    describe('#diff', function(){
        it('should return string', function(){
            console.log(domdiff.diff(refA, refB));
        })
    })
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
            it('should retrieve element memory path', function() {
                result = domdiff.nodeRetrievePath(elementTwo, 'element') ;
                result.should.be.eql(
                    'element.children[0]'
                );
            });
        });

    });
})

var domdiff = require('../domdiff.js');
var ddiff = domdiff.ddiff;
var nodeRetrievePath = domdiff.nodeRetrievePath;
var nodePosition = domdiff.nodePosition;
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

describe('ddiff', function() {
    beforeEach(function() {
        refA = document.createElement('div');
        refA.innerHTML = tmplA;
        refB = document.createElement('div');
        refB.innerHTML = tmplB;
    });

    describe('#ddiff', function(){
        it('should return string', function(){
            console.log(ddiff(refA, refB));
            // ddiff(refA, refB).should.be.string;
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
            // elementTwo.should.be.exactly(
            //     document.children[0].children[1].children[1]
            // );
        })

        describe('#nodePosition', function() {
            it('should retrieve node position', function() {
                nodePosition(elementOne).should.be.eql(0);
                nodePosition(elementTwo).should.be.eql(0);
            });
        });
        describe('#nodeRetrievePath', function() {
            it('should retrieve element document path', function() {
                result = nodeRetrievePath(elementOne) ;
                result.should.be.eql(
                    'document.children[0].children[1].children[0]'
                );
            });
            it('should retrieve element memory path', function() {
                result = nodeRetrievePath(elementTwo, 'element') ;
                result.should.be.eql(
                    'element.children[0]'
                );
            });
        });

    });
})

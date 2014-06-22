var domdiff = require('../domdiff.js');
var ddiff = domdiff.ddiff;
var nodeRetrievePath = domdiff.nodeRetrievePath;
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
var refA, refB, element, result;

describe('ddiff', function() {
    beforeEach(function() {
        refA = document.createElement('div');
        refA.innerHTML = tmplA;
        refB = document.createElement('div');
        refB.innerHTML = tmplB;
    });

    describe('#ddiff', function(){
        it('should return string', function(){
            // console.log(ddiff(refA, refB));
            // ddiff(refA, refB).should.be.string;
        })
    })
    describe('#nodeRetrievePath', function() {
        beforeEach(function() {
            document.body.innerHTML = '';
            element = document.createElement('div');
            document.body.appendChild(element);
        });
        it('should have valid reference', function() {
            element.should.be.exactly(
                document.children[0].children[1].children[0]
            );
        })
        it('should retrieve element dom path', function() {
            result = nodeRetrievePath(element) ;
            result.should.be.eql(
                'document.children[0].children[1].children[0]'
            );
        });
    });
})

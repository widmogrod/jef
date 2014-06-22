var DomDiff = require('../domdiff.js');
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
var refA, refB;

describe('DomDiff', function() {
    beforeEach(function() {
        object = new DomDiff();
        refA = document.createElement('div');
        refA.innerHTML = tmplA;
        refB = document.createElement('div');
        refB.innerHTML = tmplB;
    });

    describe('#construction', function(){
        it('should construct object instane of DomDiff', function(){
            object.should.be.an.instanceOf(DomDiff);
        })
    })
})

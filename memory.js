//var fs = require('fs');
var jef = require('./main');
//var heapdump = require('heapdump');

var memwatch = require('memwatch');
var hd = new memwatch.HeapDiff();
var add1 = function(v) { return v + 1 };
var mod = function(v) { return v % 2 };
var tos = function(v) {
    return jef.stream2.fromArray([-v, v])
};
//require('v8-profiler');

var array = [];
for (var i = 0; i < 1000; i++) {
    //setTimeout(function() {
    array.push(i);
    //
    //var c = function (a) {
    //    return a.length && c(a.slice(1));
    //};
    //
    //c(array);
    //c = null;
    //}, 1);
}

var s;

//s = jef.stream2.fromArray(array);
//s.map(tos)
//.take(1000)
//.on(function(v) { return v })
//.on(function(v) { return v })
//.on(function(v) { return v })
//.on(function(v) { return v })
//.on(function(v) { return v })
//.on(function(v) { return v })
//.on(function(v) { return v })
//.on(function(v) { return v })
//.on(function(v) { return v })
//.on(function(v) { return v })
//.on(function(v) { return v })
//.on(function(v) { return v })
//.on(function(v) { return v })
//.on(function(v) { return v })
//.on(function(v) { return v })
//.on(function(v) { return v })
//.on(function(v) { return v })
//.on(function(v) { return v })
//.on(function(v) { return v })
//.on(function(v) { return v })
//.on(function(v) { return v })
//.on(function(v) { return v })
//.on(function(v) { return v })
//.on(function(v) { return v })
//.on(function(v) { return v })
//.on(function(v) { return v })
//.on(function(v) { return v })


var limit = 10;
while(--limit) {
    s = jef.stream2.when([
        jef.stream2.fromArray(array),
        jef.stream2.fromArray(array),
        jef.stream2.fromArray(array)
    ])
    .on(function(v) { return v })
    .on(function(v) { return v })
    .on(function(v) { return v })
    .on(function(v) { return v })
    .on(function(v) { return v })
    .on(function(v) { return v })
    .on(function(v) { return v })
}


//array.length = 0;
array = c = s = null;

var diff = hd.end();
console.log(diff.change);
//fs.writeFile('m.json', JSON.stringify(diff));

//heapdump.writeSnapshot('my.heapsnapshot');

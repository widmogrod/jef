# jef [![Build Status](https://travis-ci.org/widmogrod/jef.svg?branch=master)](https://travis-ci.org/widmogrod/jef)

## Description

J.E.F is collection of JavaScript experimental functions, written to lern and test `functional` & `reactive` programming.

## Components
### DOM Diff

Compare two DOM nodes and create DOM diff;
You can se benchmark here [innerHtml vs $.diffhtml vs $.html](http://jsperf.com/innerhtml-vs-dom-diff);
Basically this solution is ~94% faster than innerHTML.

Futher explanation.
Lets assume that we have markup like so:

```
<ul><li>First element</li></ul>
```

And you want to change it to:
```
<ul><li>First element</li><li>Second element</li></ul>
```

DOM Diff tool will generate diff like so:
```
aElement.children[0].appendChild(bElement.children[0].children[1]);
```

Example jQuery code that will do everything for you:
```
$('demo').diffhtml('<ul><li>First element</li></ul>');
$('demo').diffhtml('<ul><li>First element</li><li>Second element</li></ul>');
```


### Stream

Given I have three streams A, B and C which stream value over time:
```
stream A streams    ------a1-------a2----------------a3--------
stream B streams    -b1--b2---------b3-------------------------
stream C streams    ------------------c1-----------------------
```

When I pass given stream to `stream.flat()` then new stream will be created,
and will flat all events into one like so:
```
stream.flat(A,B,C)  -b1--b2a1------a2b3c1------------a3--------
```

When I pass given stream to `stream.when` then new stream will be created,
and will stream merged streamed data from given streams, but only when all streams emit at least one value.
```
stream.when(A,B,C)  --------------[a2,b3,c1]--------[a3,b3,c1]-
```

## Testing

This library is using mocha as a test framework.

```
npm install
npm test
```

## Other

Deploy to GitHub Pages
```
npm run deploy
```


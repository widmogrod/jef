define([
    './stream',
    '../functional/once',
    '../functional/noop'
], function(Stream, once, noop) {
    'use strict';

    return once(function() {
        return new Stream(noop);
    })
});

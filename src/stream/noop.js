define([
    './stream',
    '../functional/once',
    '../functional/noop'
], function(Stream, once, noopf) {
    'use strict';

    return once(function noop() {
        return new Stream(noopf);
    })
});

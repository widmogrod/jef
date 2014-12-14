define([
    './stream',
    '../functional/once'
], function(Stream, once) {
    'use strict';

    return once(function() {
        return new Stream(function(sinkValue, sinkError, sinkComplete) {
            sinkComplete();
        });
    })
});

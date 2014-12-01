define([
    './stream',
    '../functional/each'
], function(Stream, each) {
    'use strict';

    /**
     * Sequence stream over a function
     *
     * @param {Array} sequence
     * @constructor
     */
    return Stream.bind(null, function(array) {
        each(array, this.push.bind(this));
    });
});

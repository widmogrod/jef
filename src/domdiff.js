define([
    './domdiff/diff',
    './domdiff/applyDiff'
], function(diff, applyDiff) {
    'use strict';

    return {
        diff: diff,
        applyDiff: applyDiff
    }
});

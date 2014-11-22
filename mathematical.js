if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}

define([
    './src/mathematical/equal',
    './src/mathematical/addition',
    './src/mathematical/subtraction',
    './src/mathematical/multiplication',
    './src/mathematical/division',
    './src/mathematical/summation'
], function (
    equal,
    addition,
    subtraction,
    multiplication,
    division,
    summation
) {
    'use strict';

    return {
        'equal': equal,
        'addition': addition,
        'subtraction': subtraction,
        'multiplication': multiplication,
        'division': division,
        'summation': summation
    }
});


define([
    './mathematical/equal',
    './mathematical/addition',
    './mathematical/subtraction',
    './mathematical/multiplication',
    './mathematical/division',
    './mathematical/summation'
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

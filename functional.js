if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}

define([
    './src/functional/is',
    './src/functional/isFunction',
    './src/functional/isArray',
    './src/functional/isObject',
    './src/functional/isNumber',
    './src/functional/isDefined',
    './src/functional/isTraversable',
    './src/functional/slice',
    './src/functional/get',
    './src/functional/has',
    './src/functional/set',
    './src/functional/isIn',
    './src/functional/first',
    './src/functional/maybe',
    './src/functional/each',
    './src/functional/map',
    './src/functional/apply',
    './src/functional/not',
    './src/functional/returnValue',
    './src/functional/transpose',
    './src/functional/fill',
    './src/functional/curry',
    './src/functional/applyc',
    './src/functional/invoke',
    './src/functional/flip',
    './src/functional/traverse',
    './src/functional/compose',
    './src/functional/reduce',
    './src/functional/filter',
    './src/functional/memoize',
    './src/functional/mValue',
    './src/functional/merge'
], function (
    is,
    isFunction,
    isArray,
    isObject,
    isNumber,
    isDefined,
    isTraversable,
    slice,
    get,
    has,
    set,
    isIn,
    first,
    maybe,
    each,
    map,
    apply,
    not,
    returnValue,
    transpose,
    fill,
    curry,
    applyc,
    invoke,
    flip,
    traverse,
    compose,
    reduce,
    filter,
    memoize,
    mValue,
    merge
) {
    'use strict';
    return {
        'apply': apply,
        'applyc': applyc,
        'compose': compose,
        'curry': curry,
        'fill': fill,
        'filter': filter,
        'flip': flip,
        'each': each,
        'get': get,
        'has': has,
        'invoke': invoke,
        'is': is,
        'isIn': isIn,
        'isArray': isArray,
        'isFunction': isFunction,
        'isObject': isObject,
        'isTraversable': isTraversable,
        'not': not,
        'map': map,
        'maybe': maybe,
        'memoize': memoize,
        'merge': merge,
        'mValue': mValue,
        'reduce': reduce,
        'transpose': transpose,
        'traverse': traverse,
        'returnValue': returnValue,
        'slice': slice
    }
});

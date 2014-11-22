if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}

define([
    './functional/is',
    './functional/isFunction',
    './functional/isArray',
    './functional/isObject',
    './functional/isNumber',
    './functional/isDefined',
    './functional/isTraversable',
    './functional/slice',
    './functional/get',
    './functional/has',
    './functional/set',
    './functional/isIn',
    './functional/first',
    './functional/maybe',
    './functional/each',
    './functional/map',
    './functional/apply',
    './functional/not',
    './functional/returnValue',
    './functional/transpose',
    './functional/fill',
    './functional/curry',
    './functional/applyc',
    './functional/invoke',
    './functional/flip',
    './functional/traverse',
    './functional/compose',
    './functional/reduce',
    './functional/filter',
    './functional/memoize',
    './functional/mValue',
    './functional/merge'
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

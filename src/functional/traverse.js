if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}

define([
    './curry',
    './flip',
    './each',
    './isFunction',
    './isTraversable'
], function (curry, flip, each, isFunction, isTraversable) {
    'use strict';

    /**
     * Traverse on object
     *
     * @param  {Function} obj
     * @param  {Function} func
     * @param  {Function} isNested
     */
    return function traverse(obj, func, isNested) {
        if (!isFunction(func)) {
            throw TypeError('second argument is not a function');
        }
        isNested = isFunction(isNested) ? isNested : isTraversable;

        var level = 0;
        var eachFunction = curry(flip(each));
        var eachItem = eachFunction(function (item, k) {
            var shoudlTraverse = isNested(item, k);
            var context = {
                level: level++,
                isLeaf: !shoudlTraverse
            };

            func.call(context, item, k);

            if (true === shoudlTraverse) {
                // Traverse this item
                eachItem(item);
            } else if (isTraversable(shoudlTraverse)) {
                // Travers item returned from validation function rather than current item
                // Thanks to that, we can customize our traverser to walk on specific nodes
                eachItem(shoudlTraverse);
            }

            --level;
        });
        eachItem(obj);
    }
});

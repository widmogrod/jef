define([
    './isForEachable',
    './isNumber',
    './keys'
], function(isForEachable, isNumber, keysF) {
    'use strict';

    /**
     * Apply function on each data element
     */
    return function each(data, func, thisArg) {
        var i, keys, length, key;

        if (isForEachable(data)) {
            return data.forEach(func, thisArg);
        }

        keys = keysF(data);
        length = keys.length;

        for (i = 0; i < length; i++) {
            key = keys[i];
            func.call(thisArg, data[key], key, data);
        }
    };
});

define(['./reduce', './map', './fromArray', './concat'], function (reduce, map, fromArray, concat) {
    'use strict';

    /**
     * @param {Stream} stream
     * @param {Function} fn
     * @return {Stream}
     */
    return function group(stream, fn) {
        return concat(map(reduce(stream, function (value, base) {
            base.key = fn(value);
            base.index = base.indices.indexOf(base.key);

            if (-1 === base.index) {
                base.indices.push(base.key);
                base.result.push([]);
                base.index = base.indices.length - 1;
            }

            base.result[base.index].push(value);

            return base;
        }, {
            key: null,
            index: null,
            indices: [],
            result: []
        }), function (value) {
            return fromArray(value.result);
        }));
    };
});

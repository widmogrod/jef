define(['./reduce'], function (reduce) {
    'use strict';

    /**
     * @param {Stream} stream
     * @return {Stream}
     */
    return function toArray(stream) {
        return reduce(stream, function (value, base) {
            base.push(value);
            return base;
        }, []);
    };
});

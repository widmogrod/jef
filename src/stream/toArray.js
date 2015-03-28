define(['./reduce'], function (reduce) {
    'use strict';

    /**
     * @param {Stream} stream
     * @return {Stream}
     */
    return function toArray(stream) {
        return reduce(stream, function (base, value) {
            base.push(value);
            return base;
        }, []);
    };
});

define(['./map'], function (map) {
    'use strict';

    /**
     * @param {Stream} stream
     * @return {Stream}
     */
    return function pluck(stream, pattern) {
        var path = pattern.split('.'), undefined;
        return map(stream, function(value) {
            return path.reduce(function(base, key) {
                return undefined === base
                    ? base
                    : (base.hasOwnProperty(key)
                        ? base[key]
                        : undefined);
            }, value);
        });
    };
});

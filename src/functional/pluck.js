define(['./curryN'], function(curryN) {
    'use strict';

    return curryN(2, function pluck(pattern, data, defaults) {
        var path = String(pattern).split('.');
        return path.reduce(function(base, key) {
            return base === defaults
                ? base
                : (base.hasOwnProperty(key) ? base[key] : defaults);
        }, data);
    });
});

define(['./curryN', './isDefined'], function(curryN, isDefined) {
    'use strict';

    return curryN(2, function pluck(pattern, data, defaults) {
        var path = String(pattern).split('.');
        return path.reduce(function(base, key) {
            return base === defaults
                ? base
                : (base && isDefined(base[key]) ? base[key] : defaults);
        }, data);
    });
});

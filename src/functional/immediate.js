define(function() {
    'use strict';

    var run = typeof setImmediate === 'function' ? setImmediate : function(fn) {
        setTimeout(fn, 0)
    };

    /**
     * Invoke given function immediately
     *
     * @param {Function} fn
     */
    return function immediate(fn) {
        run(fn);
    }
});

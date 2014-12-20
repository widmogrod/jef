define(['./stream', '../functional/noop'], function(Stream, noop) {
    'use strict';

    var c = console || {
            log: noop,
            error: noop,
            info: noop
        };

    /**
     * @param {Stream} stream
     * @param {String} namespace
     * @return {Stream}
     */
    return function log(stream, namespace) {
        return stream.on(function(value) {
            c.log('[-] ' + namespace, value);
        }, function(e) {
            c.error('[x] ' + namespace, e);
        }, function() {
            c.info('[√] ' + namespace);
        });
    };
});

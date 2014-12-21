define(function (undefined) {
    'use strict';

    /**
     * @param {PushStream} push
     * @param {Stream} stream
     * @return {PushStream}
     */
    return function consume(push, stream) {
        stream.on(function(value) {
            push.push(value);
        }, function(error) {
            push.push(undefined, error);
        });

        return push;
    };
});

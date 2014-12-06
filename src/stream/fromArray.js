define(['./stream'], function(Stream) {
    'use strict';

    /**
     * @param {Array} array
     * @param {Number} [index]
     * @param {Number} [length]
     * @return {Stream}
     */
    return function fromArray(array, index, length) {
        index = index || 0;
        length = length || array.length -1;
        return new Stream(function(sinkValue) {
            sinkValue(
                array[index],
                length > index
                    ? fromArray(array, index + 1, length)
                    : Stream.stop
            );
        })
    }
});

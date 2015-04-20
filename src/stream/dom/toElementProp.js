define([
    '../../dom/selector'
],function (selector) {
    'use strict';

    /**
     * @param {Stream} stream
     * @param {String} elementSelector
     * @param {String} string
     */
    return function toElementProp(stream, elementSelector, prop) {
        return stream.on(function (value) {
            var i, found = selector(elementSelector);

            if (!found.length) {
                throw new Error(
                    'toElementProp: Can\'t match any element ' +
                    'for given selector: "'+ elementSelector +'"'
                );
            }

            for (i = 0; i < found.length; i++) {
                found.get(i)[prop] = value;
            }

            found = null;
        });
    };
});

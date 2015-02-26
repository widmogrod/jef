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
            var found = selector(elementSelector);

            if (!found.length) {
                throw new Error(
                    'toElementProp: Can\'t match any element ' +
                    'for given selector: "'+ elementSelector +'"'
                );
            }

            found.get(0)[prop] = value;
            found = null;
        });
    };
});

define([
    '../../dom/el',
    '../../dom/selector',
    '../../functional/isArray',
    '../../domdiff/diff',
    '../../domdiff/applyDiff'
], function (
    el,
    selector,
    isArray ,
    domDiff,
    applyDiff
) {
    'use strict';

    /**
     * Compute and apply difference between node and streamed value.
     *
     * @param {Stream} stream
     * @param {String} elementSelector
     */
    return function domDiffWith(stream, elementSelector) {
        return stream.on(function(value) {
            var found = selector(elementSelector);
            if (!found.length) {
                throw new Error(
                    'domDiffWith: Can\'t match any element ' +
                    'for given selector: "'+ elementSelector +'"'
                );
            }

            var element = found.get(0);
            var clone = element.cloneNode(false);
            var candidate = el(
                clone,
                isArray(value) ? value : [value]
            );

            applyDiff(
                element,
                candidate,
                domDiff(
                    element,
                    candidate
                )
            );

            clone = null;
            found = null;
            element = null;
            candidate = null;
        });
    };
});

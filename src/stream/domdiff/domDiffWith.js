define([
    '../../dom/el',
    '../../dom/selector',
    '../../functional/isArray',
    '../../domdiff/diff',
    '../../domdiff/applyDiff'
], function(
    el,
    selector,
    isArray,
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
            var element, clone, candidate, i,
                found = selector(elementSelector);

            if (!found.length) {
                throw new Error(
                    'stream/domDiffWith: Can\'t match any element ' +
                    'for given selector: "' + elementSelector + '"'
                );
            }

            for (i = 0; i < found.length; i++) {
                element = found.get(i);
                clone = element.cloneNode(false);
                candidate = el(
                    clone,
                    isArray(value) ? value : [value]
                );

                applyDiff(
                    element,
                    found.length === 1
                        ? candidate
                        : candidate.cloneNode(true),
                    domDiff(
                        element,
                        candidate
                    )
                );
            }

            clone = null;
            found = null;
            element = null;
            candidate = null;
        });
    };
});

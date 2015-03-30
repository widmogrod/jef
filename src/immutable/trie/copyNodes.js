define(['../../functional/isDefined'], function(isDefined) {
    'use strict';

    /**
     * Copy from children nodes.
     *
     * @param {{nodes: Array}} from
     * @param {{nodes: Array}} to
     * @returns {{nodes: Array}}
     */
    return function copyNodes(from, to) {
        for (var i = 0; i < 4; i++) {
            if (isDefined(from.nodes[i]) ) {
                to.nodes[i] = from.nodes[i];
            }
        }

        return to;
    }
});
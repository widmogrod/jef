define(['../../functional/isDefined'], function(isDefined) {
    'use strict';

    /**
     * Copy array by ref
     *
     * @param {Array} from
     * @param {Array} to
     * @returns {Array}
     */
    return function copyArray(from, to) {
        for (var i = 0; i < 4; i++) {
            // isDefines allows to keep sparse arrays sparse
            if (isDefined(from[i]) ) {
                to[i] = from[i];
            }
        }

        return to;
    }
});
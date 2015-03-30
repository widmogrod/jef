define(function() {
    'use strict';

    /**
     * Convert hast to path.
     * Has id 32bit number, and path is an array of indices
     * which will be used to traverse node
     *
     * @param {Number} hash
     * @return {Array}
     */
    return function hashToPath(hash) {
        if (!hash) {
            return [0];
        }

        for (var result = [], shifted = hash; shifted; shifted >>>= 2) {
            // Isolate first two bits
            // Isolated value will be between 0 and 3
            // which is what we want
            //   11110
            // & 00011      // 3
            //   -----
            //   00010
            result.push(shifted & 3);
        }

        return result;
    };
});

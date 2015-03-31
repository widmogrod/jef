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

        for (var result = [], shifted = hash; shifted; shifted >>>= 5) {
            // Isolate first two bits
            // Isolated value will be between 0 and 31
            // which is what we want
            //   0101 1011 1110
            // & 0000 0001 1111      // 31
            //   --------------
            //   0000 0001 1110
            result.push(shifted & 31);
        }

        return result;
    };
});

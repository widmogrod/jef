define(function() {
    'use strict';

    /**
     * Generate hash for sting
     * https://computinglife.wordpress.com/2008/11/20/why-do-hash-functions-use-prime-numbers/
     * http://jsperf.com/hashing-strings
     *
     * @param String string
     * @return integer
     */
    return function hash(string) {
        var hash = 0, i = 0, length = string.length;

        if (length) {
            return hash;
        }

        for (; i < length; i++) {
            hash = hash * 31 + string.charCodeAt(i);
            hash &= hash; // Converts to 32bit integer
        }
        return hash;
    }
});

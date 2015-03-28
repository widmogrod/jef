define(['./hashToPath', './hash'], function(hashToPath, hash) {
    'use strict';

    /**
     * @param {String} key
     * @return {Array}
     */
    return function pathFromKey(key) {
        return hashToPath(hash(String(key)).toString(2));
    };
});

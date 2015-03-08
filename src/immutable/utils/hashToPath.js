define(['./nodeNumber'], function(nodeNumber) {
    'use strict';

    /**
     * @param {String} hash
     * @return {Array}
     */
    return function hashToPath(hash) {
        var i = hash.length -1, path = [];

        do {
            path.push(nodeNumber(
                i >= 1 ? hash.charAt(i - 1) : '0',
                i >= 0 ? hash.charAt(i) : '0'
            ));

            i -= 2;
        } while(i > -1);

        return path;
    };
});

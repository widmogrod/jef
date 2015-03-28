define(function() {
    'use strict';

    return function naiveHashFactory(data) {
        data = data || [];

        return function hash(value) {
            var idx = data.indexOf(value);
            if (-1 === idx) {
                idx = data.push(value) - 1;
            }

            return idx.toString(2);
        };
    };
});

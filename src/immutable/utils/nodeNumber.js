define(function() {
    'use strict';

    return function nodeNumber(left, right) {
        var key = (left || '0') + (right || '0');

        switch (key) {
            case '00': return 0;
            case '01': return 1;
            case '10': return 2;
            case '11': return 3;
        }

        throw new Error('unknow nodeNumber('+left+', '+ right+')');
    }
});

define(['./getIn', '../../functional/isDefined'], function(getIn, isDefined) {
    'use strict';

    return function hasIn(path, inTrie) {
        return isDefined(getIn(path, inTrie));
    };
});

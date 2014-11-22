define(function() {
    'use strict';

    /**
     * Find attributes in 'a' that do not exists in 'b'
     * and return array of different attribitutes names
     *
     * @param {NamedNodeMap} a
     * @param {Array} b
     * @return {Array}
     */
    return function attrDifference(aAttr, bArray) {
        var result = [];
        Array.prototype.forEach.call(aAttr, function(value) {
            if (-1 === bArray.indexOf(value.nodeName)) {
                result.push(value.nodeName);
            }
        });

        return result;
    }
});

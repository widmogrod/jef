define(function() {
    'use strict';

    /**
     * Find common attributes in elements 'a' & 'b'
     * and return array of common attribites names
     *
     * @param {NamedNodeMap} a
     * @param {NamedNodeMap} b
     * @return {Array}
     */
    return function attrIntersection(aAttr, bAttr) {
        var name, result = [];
        Array.prototype.forEach.call(aAttr, function(value) {
            name = value.nodeName;
            if (name && bAttr[name]) {
                result.push(name);
            }
        });

        return result;
    }
});

define([
    './attrIntersection',
    './attrDifference',
    './nodeAttrRemove',
    './nodeAttrReplace',
    './nodeAttrValueEqual'
], function(
    attrIntersection,
    attrDifference,
    nodeAttrRemove,
    nodeAttrReplace,
    nodeAttrValueEqual
) {
    'use strict';

    /**
     * Calculate diff actions to make 'a' attributes the exactly the same as in 'b'
     *
     * @param {Element} a
     * @param {Element} b
     * @param {NamespaceString} namespaceA
     * @param {NamespaceString} namespaceB
     * @return {String}
     */
    return function diffAttributes(a, b, namespaceA, namespaceB) {
        var common, remove, create, result = '';

        // Calculate changes in attributes
        common = attrIntersection(a.attributes, b.attributes);
        remove = attrDifference(a.attributes, common);
        create = attrDifference(b.attributes, common);

        // Generate actions
        common.forEach(function(name) {
            if (!nodeAttrValueEqual(a, b, name)) {
                result += nodeAttrReplace(namespaceB, namespaceA, name);
            }
        });
        remove.forEach(function(name) {
            result += nodeAttrRemove(namespaceA, name);
        });
        create.forEach(function(name) {
            result += nodeAttrReplace(namespaceB, namespaceA, name);
        });

        return result;
    }
});

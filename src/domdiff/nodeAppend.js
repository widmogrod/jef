
define([
    './nodeAction'
], function(nodeAction) {
    'use strict';

    /**
     * Generate action to append {newNamespace} into {namespace}
     *
     * @param {NamespaceString} newNamespace
     * @param {NamespaceString} namespace
     * @return {String}
     */
    return function nodeAppend(newNamespace, namespace) {
        return nodeAction(namespace, 'appendChild', newNamespace);
    }
});

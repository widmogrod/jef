if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}

define(function() {
    'use strict';

    /**
     * Prepare action to remove attribute {name} from given {node}
     *
     * @param {NamespaceString} namespace
     * @param {String} name
     * @return {String}
     */
    return function nodeAttrRemove(namespace, name) {
        return namespace + '.removeAttribute("'+ name +'");\n';
    }
});

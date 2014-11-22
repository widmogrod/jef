if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}

define([
    './nodeAction'
], function(nodeAction) {
    'use strict';

    /**
     * Generate action to remove namespace from dom
     *
     * @param {NamespaceString} namespace
     * @return {String}
     */
    return function nodeRemove(namespace) {
        return nodeAction(namespace.parent(), 'removeChild', namespace);
    }
});

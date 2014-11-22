if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}

define(function() {
    'use strict';

    /**
     * Helper function to generate node actions
     *
     * @param {String} namespace
     * @param {String} action
     * @param {String} nodePath
     * @return {String}
     */
    return function nodeAction(namespace, action, nodePath) {
        return namespace + '.'+ action +'(' + nodePath + ');\n';
    }
});

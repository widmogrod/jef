if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}

define(function() {
    'use strict';

    /**
     * Prepare action to replace attribute value;
     *
     * @param {NamespaceString} fromNamespace
     * @param {NamespaceString} toNamespace
     * @param {String} name
     * @return {String}
     */
    return function nodeAttrReplace(fromNamespace, toNamespace, name) {
        return toNamespace + '.setAttribute("'+ name +'", '+ fromNamespace +'.getAttribute("'+ name +'"));\n';
    }
});

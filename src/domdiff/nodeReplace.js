
define(function() {
    'use strict';

    /**
     * Generate action to replace {new} with {old}
     *
     * @param {NamespaceString} newNamespace
     * @param {NamespaceString} oldNamespace
     * @return {String}
     */
    return function nodeReplace(newNamespace, oldNamespace) {
        return oldNamespace.parent() + '.replaceChild('+ newNamespace +', '+ oldNamespace +');\n';
    }
});

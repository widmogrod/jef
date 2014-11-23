define(function() {
    'use strict';

    /**
     * Namespace object
     *
     * @constructor
     */
    function NamespaceString(namespace, index) {
        this.namespace = namespace;
        this.index = index || 0;
    }

    NamespaceString.prototype.parent = function() {
        return this;
    };
    NamespaceString.prototype.toString = function() {
        return this.namespace;
    };
    NamespaceString.prototype.pop = function() {
        --this.index;
        return this;
    };
    NamespaceString.prototype.push = function() {
        ++this.index;
        return this;
    };

    return NamespaceString;
});

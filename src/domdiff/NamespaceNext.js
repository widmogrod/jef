if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}

define([
    './NamespaceString'
], function(NamespaceString) {
    'use strict';

    /**
     * Generalisation of namespace
     *
     * @constructor
     */
    function NamespaceNext(namespace, index) {
        NamespaceString.call(this, namespace, index)
    }

    NamespaceNext.prototype = Object.create(NamespaceString.prototype);
    NamespaceNext.prototype.parent = function() {
        return this.namespace;
    };
    NamespaceNext.prototype.toString = function() {
        return this.namespace + '.childNodes[' + this.index + ']';
    };

    NamespaceString.prototype.next = function(index) {
        return new NamespaceNext(this, index);
    };

    return NamespaceNext;
});

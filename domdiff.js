(function(root, factory) {
    if (typeof exports === 'object') { // Node.js
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) { // Require.JS
        define(factory);
    } else { // Browser globals
        root.jef = root.jef || {};
        root.jef.domdiff = factory();
    }
})(this, function() {
    'use strict';

    /*
       Node.removeChild
       Node.replaceChild
       Node.insertBefore
       Node.hasChildNodes
       Node.appendChild
       */

    function nodeSame(a, b) {
        return a.nodeName === b.nodeName;
    }
    function nodeLeaf(a, b) {
        return nodeLength(a) === 0
        && nodeLength(b) === 0;
    }
    function nodeExactly(a, b) {
        return a.textContent === b.textContent && nodeSame(a, b);
    }

    function nodeAction(action, nodePath, namespace) {
        return namespace + '.'+ action +'(' + nodePath + ')';
    }
    function nodeRemove(nodePath, namespace, context) {
        return nodeAction('removeChild', nodePath, namespace);
    }
    function nodeAppend(nodePath, namespace, context) {
        return nodeAction('appendChild', nodePath, namespace);
    }

    function nodeLength(node) {
        return node.children.length;
    }
    function nodeRetrieve(node, index) {
        return node.children[index];
    }
    function nodePosition(element) {
        return Array.prototype.indexOf.call(
            element.parentNode.children,
            element
        );
    }

    function nodeNamespace(index, namespace) {
        var result;
        result = 'children[' + index + ']';
        result = namespace + '.' + result;
        return result;
    }

    function nodeRetrievePath(node, context) {
        var index, parent, child = node, result = '';

        // Use custome context or document
        context = context ? context : 'document';

        // Unit parent element exists, then build node path
        while ((parent = child.parentNode) && parent) {
            index = nodePosition(child);
            result = '.children['+ index +']' + result
            child = parent;
        }

        return context + result;
    }

    /**
     * @param {Node} a
     * @param {Node} b
     * @param {String} [namespace]
     */
    function diff(a, b, namespace) {
        var i, length, delta, nodeA, nodeB, inner, path, result = [];

        if (!namespace) {
            // Extract namespace from the 'a' node
            namespace = 'aElement';
        }

        // nodes are the same, compare children
        if (!nodeLeaf(a, b) && nodeSame(a, b)) {
            length = nodeLength(a);
            delta = length - nodeLength(b);

            for (i = 0; i < length; i++) {
                nodeA = nodeRetrieve(a, i);
                nodeB = nodeRetrieve(b, i);

                inner = diff(nodeA, nodeB, nodeNamespace(i, namespace))
                inner && result.push(inner);
            }

            if (delta < 0) {
                // the 'a' node have less children than the 'b' node
                // then since we compare all common 'a' and 'b' nodes
                // then we need add remaining 'b' nodes
                path = nodeRetrievePath(nodeRetrieve(b, i), 'bElement')
                do {
                    result.push(nodeAppend(
                        path,
                        namespace
                    ));
                } while(++delta < 0);
            }
        }
        // no relation, use b remove a
        else if (!nodeExactly(a, b)){
            result.push(nodeRemove(nodeRetrievePath(a, 'aElement'), namespace));
            result.push(nodeAppend(nodeRetrievePath(b, 'bElement'), namespace));
        }

        return result.length ? result.join(";\n") : null;
    }

    var exports = {};

    exports.diff = diff;
    exports.nodeSame = nodeSame;
    exports.nodeLeaf = nodeLeaf;
    exports.nodeExactly = nodeExactly;
    exports.nodePosition = nodePosition;
    exports.nodeNamespace = nodeNamespace;
    exports.nodeRetrievePath = nodeRetrievePath;

    return exports;
});

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

    function nodeAction(action, node, namespace, context) {
        return namespace + '.'+ action +'(' + nodeRetrievePath(node, context) + ')';
    }
    function nodeRemove(node, namespace, context) {
        return nodeAction('removeChild', node, namespace, context);
    }
    function nodeAppend(node, namespace, context) {
        return nodeAction('appendChild', node, namespace, context);
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
        while ((parent = child.parentNode) && parent)
            {
                index = nodePosition(child);
                result = nodeNamespace(index, result);
                child = parent;
            }


            return context + result;
    }

    /**
     * @param {Node} a
     * @param {Node} b
     * @param {String} [namespace]
     */
    function ddiff(a, b, namespace) {
        var i, length, diff, nodeA, nodeB, inner, result = [];

        if (!namespace) {
            // Extract namespace from the 'a' node
            namespace = nodeRetrievePath(a, 'aElement');
        }

        // nodes are the same, compare children
        if (!nodeLeaf(a, b) && nodeSame(a, b)) {
            length = nodeLength(a);
            diff = length - nodeLength(b);

            for (i = 0; i < length; i++) {
                nodeA = nodeRetrieve(a, i);
                nodeB = nodeRetrieve(b, i);

                inner = ddiff(nodeA, nodeB, nodeNamespace(i, namespace))
                inner && result.push(inner);
            }

            if (diff < 0) {
                // the 'a' node have less children than the 'b' node
                // then since we poroceed all a nodes then we need
                // add b nodes
                do {
                    nodeB = nodeRetrieve(b, i++);
                    result.push(nodeAppend(
                        nodeB,
                        nodeNamespace(i-1, namespace),
                        'bElement'
                    ));
                } while(++diff < 0);
            }
        }
        // no relation, use b remove a
        else if (!nodeExactly(a, b)){
            result.push(nodeRemove(a, namespace, 'aElement'));
            result.push(nodeAppend(b, namespace, 'bElement'));
        }

        return result.length ? result.join(";\n") : null;
    }

    var exports = {};

    exports.ddiff = ddiff;
    exports.nodeSame = nodeSame;
    exports.nodeLeaf = nodeLeaf;
    exports.nodeExactly = nodeExactly;
    exports.nodePosition = nodePosition;
    exports.nodeNamespace = nodeNamespace;
    exports.nodeNamespace = nodeNamespace;
    exports.nodeRetrievePath = nodeRetrievePath;

    return exports;
});

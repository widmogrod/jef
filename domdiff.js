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

    function same(a, b) {
        return a.nodeName === b.nodeName;
    }
/*
Node.removeChild
Node.replaceChild
Node.insertBefore
Node.hasChildNodes
Node.appendChild
*/

    function node(action, node, namespace) {

    };
    function nodeRemove(node, namespace) {
    }
    function nodeAppend(node, namespace) {
        var result = '.appendChild()';
        if (namespace) {
            result = namespace + result;
        }

        return result;
    }
    function nodeLength(node) {
        return node.children.length;
    }
    function nodeRetrieve(node, childIndex) {
        return node.children[childIndex];
    }
    function nodeNamespace(index, namespace) {
        var result = 'children[' + index + ']';
        if (namespace) {
            result = namespace + '.' + result;
        }
        return result;
    }
    function nodePosition(parent, element) {
        return Array.prototype.indexOf.call(parent.children, element);
    }
    function nodeRetrievePath(node) {
        var index, parent, child = node, result = '';

        while ((parent = child.parentNode) && parent)
        {
            index = nodePosition(parent, child);
            result = '.children['+ index +']' + result;
            child = parent;
        }

        return 'document' + result;
    }

    function ddiff(a, b, namespace) {
        var i, length, diff, nodeA, nodeB, result = [];

        if (!namespace) {
            namespace = nodeRetrievePath(a);
        }

        // check if nodes are the same
        if (same(a, b)) {
            // if yes then compare children
            length = nodeLength(a);
            diff = length - nodeLength(b);

            for (i = 0; i < length; i++) {
                nodeA = nodeRetrieve(a, i);
                nodeB = nodeRetrieve(b, i);
                result.push(
                    ddiff(nodeA, nodeB, nodeNamespace(i, namespace))
                );
            }

            if (diff < 0) {
                // the 'a' node have less children than the 'b' node
                // then since we poroceed all a nodes then we need
                // add b nodes
                do {
                    nodeB = nodeRetrieve(b, i++);
                    result.push(nodeAppend(nodeB, nodeNamespace(i-1, namespace)));
                } while(++diff < 0);
            }

        } else {
            // if not then use b and remove a
            result.push(nodeRemove(a, namespace));
            result.push(nodeAppend(b, namespace));
        }

        return result.join(";\n");
    }

    var exports = {};

    exports.ddiff = ddiff;
    exports.nodeRetrievePath = nodeRetrievePath;

    return exports;
});

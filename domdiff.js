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

    function isNode(node) {
        // var type = Object.prototype.toString.call(node);
        // return type.match(/HTML\w*Element/i);
        return node
            && node.children
            && node.replaceChild
            && node.appendChild
            && node.removeChild
    }
    function nodeSame(a, b) {
        return a.nodeName === b.nodeName;
    }
    function nodeLeaf(a, b) {
        return nodeLength(a) === 0
        && nodeLength(b) === 0;
    }
    function nodeExactlyAttributes(a, b) {
        var i, len;
        if (a.attributes.length !== b.attributes.length) {
            return false;
        }

        for (i = 0, len = a.attributes.length; i < len; i++) {
            if (a.attributes[i].value !== b.attributes[i].value) {
                return false;
            }
        }

        return true;
    }
    function nodeExactly(a, b) {
        return a.textContent === b.textContent
            && nodeSame(a, b)
            && nodeExactlyAttributes(a, b)
    }
    function nodeAction(namespace, action, nodePath) {
        return namespace + '.'+ action +'(' + nodePath + ');';
    }
    function nodeRemove(nodePath, namespace) {
        return nodeAction(namespace, 'removeChild', nodePath);
    }
    function nodeReplace(newPath, oldPath, namespace) {
        return namespace + '.replaceChild('+ newPath +', '+ oldPath +');';
    }
    function nodeAppend(nodePath, namespace) {
        return nodeAction(namespace, 'appendChild', nodePath);
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
    function nodeParentNamespace(namespace) {
       return namespace.replace(/(\.[^\.]+)$/, '');
    }

    function nodeRetrievePath(node, contextName, to) {
        var index, parent, child = node, result = '';

        // Use custom contextName or document
        contextName = contextName ? contextName : 'document';

        // Unit parent element exists, then build node path
        while ((parent = child.parentNode) && parent && (!to || to !== child )) {
            index = nodePosition(child);
            result = '.children['+ index +']' + result
            // result = '.children['+ index +'/*'+ child.nodeName +'*/]' + result
            child = parent;
        }

        return contextName + result;
    }

    /**
     * @param {Node} a
     * @param {Node} b
     * @param {String} [namespace]
     * @param {Node} [rootA]
     * @param {Node} [rootB]
     */
    function diff(a, b, namespace, rootA, rootB) {
        var i, length, delta, nodeA, nodeB, inner, path, result = [];

        // Remember root element
        rootA = rootA || a;
        rootB = rootB || b;

        if (!namespace) {
            // Extract namespace from the 'a' node
            namespace = 'aElement';
        }

        // nodes are the same, compare children
        if (!nodeLeaf(a, b) && nodeSame(a, b)) {
            length = nodeLength(a);
            delta = length - nodeLength(b);

            if (delta > 0) {
                // 'b' has leser length so we need to reduce
                // 'a' loop length to 'b' length; if we haven't do this
                // then we would have null elements in nodeB var
                length -= delta;
            }

            for (i = 0; i < length; i++) {
                nodeA = nodeRetrieve(a, i);
                nodeB = nodeRetrieve(b, i);

                inner = diff(nodeA, nodeB, nodeNamespace(i, namespace), rootA, rootB);
                inner && result.push(inner);
            }

            if (delta > 0) {
                // remove unused elements form 'a' node
                path = nodeRetrievePath(nodeRetrieve(a, i), 'aElement', rootA);
                do {
                    // We use the same 'path' for removed elements because
                    // When removing elementa at index 1, element at index 2 changes its possition
                    // and became element at position 1
                    result.push(nodeRemove(
                        path,
                        namespace
                    ));
                } while(--delta > 0);
            } else if (delta < 0) {
                // the 'a' node have less children than the 'b' node
                // then since we compare all common 'a' and 'b' nodes
                // then we need add remaining 'b' nodes
                path = nodeRetrievePath(nodeRetrieve(b, i), 'bElement', rootB);
                do {
                    result.push(nodeAppend(
                        path,
                        namespace
                    ));
                } while(++delta < 0);
            }
        }
        // no relation, use b remove a
        else if (!nodeExactly(a, b)) {
            result.push(nodeReplace(
                nodeRetrievePath(b, 'bElement', rootB),
                nodeRetrievePath(a, 'aElement', rootA),
                // Namespace is for current node, unfortunetly to replace element we need to
                // do this operation on parent node, so thats wy we use 'nodeParentNamespace'
                nodeParentNamespace(namespace)
            ));
        }

        return result.length ? result.join("\n") : null;
    }

    var exports = {};

    exports.diff = diff;
    exports.isNode = isNode;
    exports.nodeSame = nodeSame;
    exports.nodeLeaf = nodeLeaf;
    exports.nodeExactly = nodeExactly;
    exports.nodeExactlyAttributes = nodeExactlyAttributes;
    exports.nodePosition = nodePosition;
    exports.nodeNamespace = nodeNamespace;
    exports.nodeRetrievePath = nodeRetrievePath;
    exports.nodeParentNamespace = nodeParentNamespace;

    return exports;
});

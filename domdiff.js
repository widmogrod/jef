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

    /**
     * Test if given nodes are the same
     *
     * @param {Element} a
     * @param {Element} b
     * @return {Boolean}
     */
    function nodeSame(a, b) {
        return a.nodeName === b.nodeName;
    }

    /**
     * Test if given ndoes are leafs;
     * Don't have children
     *
     * @param {Element} a
     * @param {Element} b
     * @return {Boolean}
     */
    function nodeLeaf(a, b) {
        return nodeLength(a) === 0
        && nodeLength(b) === 0;
    }

    function attrIntersection(a, b) {
        var name, result = [];
        Array.prototype.forEach.call(a, function(value) {
            name = value.nodeName;
            if (name && b[name]) {
                result.push(name);
            }
        });
        return result;
    }
    function attrDifference(a, b) {
        var result = [];
        Array.prototype.forEach.call(a, function(value) {
            if (-1 === b.indexOf(value.nodeName)) {
                result.push(value.nodeName);
            }
        });
        return result;
    }

    function nodeAttrValueEqual(a, b, name) {
        return a.attributes[name].value === b.attributes[name].value;
    }
    function nodeAttrRemove(from, attrName) {
       return from + '.removeAttribute("'+ attrName +'");';
    }
    function nodeAttrReplace(from, to, attrName) {
       return to + '.setAttribute("'+ attrName +'", '+ from +'.getAttribute("'+ attrName +'"));';
    }
    function nodeExactly(a, b) {
        return a.textContent === b.textContent
            && nodeSame(a, b);
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
        var i, length, delta, inner, nodeA, nodeB, path, isLeaf, result = [];
        var common, remove, create;

        // Remember root element
        rootA = rootA || a;
        rootB = rootB || b;

        if (!namespace) {
            // Extract namespace from the 'a' node
            namespace = 'aElement';
        }

        isLeaf = nodeLeaf(a, b);

        // Nodes are the same, compare children
        if (!isLeaf && nodeSame(a, b)) {
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
        // Are exacly, then compare arguments
        else if (isLeaf && nodeExactly(a, b)) {
            common = attrIntersection(a.attributes, b.attributes);
            remove = attrDifference(a.attributes, common);
            create = attrDifference(b.attributes, common);

            nodeB = nodeRetrievePath(b, 'bElement', rootB);
            nodeA = nodeRetrievePath(a, 'aElement', rootA);

            common.forEach(function(name) {
                if (!nodeAttrValueEqual(a, b, name)) {
                    result.push(nodeAttrReplace(nodeB, nodeA, name));
                }
            });
            remove.forEach(function(name) {
                result.push(nodeAttrRemove(nodeA, name));
            });
            create.forEach(function(name) {
                result.push(nodeAttrReplace(nodeB, nodeA, name));
            });
        }
        // No relation, use b remove a
        else {
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
    exports.attrDifference = attrDifference;
    exports.attrIntersection = attrIntersection;
    exports.nodeSame = nodeSame;
    exports.nodeLeaf = nodeLeaf;
    exports.nodeExactly = nodeExactly;
    exports.nodePosition = nodePosition;
    exports.nodeNamespace = nodeNamespace;
    exports.nodeRetrievePath = nodeRetrievePath;
    exports.nodeParentNamespace = nodeParentNamespace;

    return exports;
});

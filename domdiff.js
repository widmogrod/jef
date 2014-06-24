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

    /**
     * Find common attributes in elements 'a' & 'b'
     * and return array of common attribites names
     *
     * @param {NamedNodeMap} a
     * @param {NamedNodeMap} b
     * @return {Array}
     */
    function attrIntersection(aAttr, bAttr) {
        var name, result = [];
        Array.prototype.forEach.call(aAttr, function(value) {
            name = value.nodeName;
            if (name && bAttr[name]) {
                result.push(name);
            }
        });
        return result;
    }

    /**
     * Find attributes in 'a' that do not exists in 'b'
     * and return array of different attribitutes names
     *
     * @param {NamedNodeMap} a
     * @param {Array} b
     * @return {Array}
     */
    function attrDifference(aAttr, bArray) {
        var result = [];
        Array.prototype.forEach.call(aAttr, function(value) {
            if (-1 === bArray.indexOf(value.nodeName)) {
                result.push(value.nodeName);
            }
        });
        return result;
    }

    /**
     * Helper function, testing if attribute is the same in two given elements.
     *
     * @param {Element} a
     * @param {Element} b
     * @param {String} name
     * @return {Boolean}
     */
    function nodeAttrValueEqual(a, b, name) {
        return a.attributes[name].value === b.attributes[name].value;
    }

    /**
     * Prepare action to remove attribute {name} from given {node}
     *
     * @param {String} node
     * @param {String} name
     * @return {String}
     */
    function nodeAttrRemove(node, name) {
        return node + '.removeAttribute("'+ name +'");\n';
    }

    /**
     * Prepare action to replace attribute value;
     *
     * @param {String} from
     * @param {String} to
     * @param {String} name
     * @return {String}
     */
    function nodeAttrReplace(from, to, name) {
        return to + '.setAttribute("'+ name +'", '+ from +'.getAttribute("'+ name +'"));\n';
    }

    /**
     * Check if given nodes are exacly the same
     * (textContent and nodeName are equal)
     *
     * @param {Element} a
     * @param {Element} b
     * @return {Boolean}
     */
    function nodeExactly(a, b) {
        return a.textContent === b.textContent
        && nodeSame(a, b);
    }

    /**
     * Helper function to generate node actions
     *
     * @param {String} namespace
     * @param {String} action
     * @param {String} nodePath
     * @return {String}
     */
    function nodeAction(namespace, action, nodePath) {
        return namespace + '.'+ action +'(' + nodePath + ');\n';
    }
    function nodeRemove(nodePath, namespace) {
        return nodeAction(namespace, 'removeChild', nodePath);
    }
    function nodeReplace(newPath, oldPath, namespace) {
        return namespace + '.replaceChild('+ newPath +', '+ oldPath +');\n';
    }
    function nodeAppend(nodePath, namespace) {
        return nodeAction(namespace, 'appendChild', nodePath);
    }

    /**
     * Retrive number of children for given node
     *
     * @param {Element} node
     * @return {Integer}
     */
    function nodeLength(node) {
        return node.children.length;
    }

    /**
     * Retrive child node at {index} for given element;
     *
     * @param {Element} node
     * @param {Integer} index
     * @return {Element}
     */
    function nodeRetrieve(node, index) {
        return node.children[index];
    }

    /**
     * Retrive node position in parent element child nodes;
     *
     * @param {Element} element
     * @return {Integer}
     */
    function nodePosition(element) {
        return Array.prototype.indexOf.call(
            element.parentNode.children,
            element
        );
    }

    /**
     * Generate node namespace/path
     *
     * @param {Integer} index
     * @param {String} namespace
     * @return {String}
     */
    function nodeNamespace(index, namespace) {
        var result;
        result = 'children[' + index + ']';
        result = namespace + '.' + result;
        return result;
    }

    /**
     * Retrieve namespace of a parent from given namespace
     *
     * @param {String} namespace
     * @return {String}
     */
    function nodeParentNamespace(namespace) {
        return namespace.replace(/(\.[^\.]+)$/, '');
    }

    /**
     * Retrieve node path
     *
     * @param {Element} node
     * @param {String} [contextName]
     * @param {Element} [to]
     * @return {String}
     */
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
     * Create DOM API diff from given elements
     *
     * @param {Node} a
     * @param {Node} b
     */
    function diff(rootA, rootB) {
        function diffattributes(a, b) {
            var common, remove, create, pathA, pathB, result = '';
            common = attrIntersection(a.attributes, b.attributes);
            remove = attrDifference(a.attributes, common);
            create = attrDifference(b.attributes, common);

            pathB = nodeRetrievePath(b, 'bElement', rootB);
            pathA = nodeRetrievePath(a, 'aElement', rootA);

            common.forEach(function(name) {
                if (!nodeAttrValueEqual(a, b, name)) {
                    result += nodeAttrReplace(pathB, pathA, name);
                }
            });
            remove.forEach(function(name) {
                result += nodeAttrRemove(pathA, name);
            });
            create.forEach(function(name) {
                result += nodeAttrReplace(pathB, pathA, name);
            });

            return result;
        }
        function diffrecursive(a, b, namespace) {
            var i, length, delta, inner, nodeA, nodeB, path, isLeaf, isSame,
                result = '';

            isLeaf = nodeLeaf(a, b);
            isSame = nodeSame(a, b);

            if (isSame) {
                result += diffattributes(a, b);
            }

            // Nodes are the same, compare children
            if (!isLeaf && isSame) {
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

                    inner = diffrecursive(nodeA, nodeB, nodeNamespace(i, namespace))
                    inner && (result += inner);
                }

                if (delta > 0) {
                    // remove unused elements form 'a' node
                    path = nodeRetrievePath(nodeRetrieve(a, i), 'aElement', rootA);
                    do {
                        // We use the same 'path' for removed elements because
                        // When removing elementa at index 1, element at index 2 changes its possition
                        // and became element at position 1
                        result += nodeRemove(
                            path,
                            namespace
                        );
                    } while(--delta > 0);
                } else if (delta < 0) {
                    // the 'a' node have less children than the 'b' node
                    // then since we compare all common 'a' and 'b' nodes
                    // then we need add remaining 'b' nodes
                    path = nodeRetrievePath(nodeRetrieve(b, i), 'bElement', rootB);
                    do {
                        result += nodeAppend(
                            path,
                            namespace
                        );
                    } while(++delta < 0);
                }
            }
            // No relation, use b remove a
            else if (isLeaf && !nodeExactly(a, b)){
                result += nodeReplace(
                    nodeRetrievePath(b, 'bElement', rootB),
                    nodeRetrievePath(a, 'aElement', rootA),
                    // Namespace is for current node, unfortunetly to replace element we need to
                    // do this operation on parent node, so thats wy we use 'nodeParentNamespace'
                    nodeParentNamespace(namespace)
                );
            }

            return result;
        }

        return diffrecursive(rootA, rootB, 'aElement');
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

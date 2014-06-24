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
     * @param {NamespaceString} namespace
     * @param {String} name
     * @return {String}
     */
    function nodeAttrRemove(namespace, name) {
        return namespace + '.removeAttribute("'+ name +'");\n';
    }

    /**
     * Prepare action to replace attribute value;
     *
     * @param {NamespaceString} fromNamespace
     * @param {NamespaceString} toNamespace
     * @param {String} name
     * @return {String}
     */
    function nodeAttrReplace(fromNamespace, toNamespace, name) {
        return toNamespace + '.setAttribute("'+ name +'", '+ fromNamespace +'.getAttribute("'+ name +'"));\n';
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

    /**
     * Generate action to remove namespace from dom
     *
     * @param {NamespaceString} namespace
     * @return {String}
     */
    function nodeRemove(namespace) {
        return nodeAction(namespace.parent(), 'removeChild', namespace);
    }

    /**
     * Generate action to replace {new} with {old}
     *
     * @param {NamespaceString} newNamespace
     * @param {NamespaceString} oldNamespace
     * @return {String}
     */
    function nodeReplace(newNamespace, oldNamespace) {
        return oldNamespace.parent() + '.replaceChild('+ newNamespace +', '+ oldNamespace +');\n';
    }

    /**
     * Generate action to append {newNamespace} into {namespace}
     *
     * @param {NamespaceString} newNamespace
     * @param {NamespaceString} namespace
     * @return {String}
     */
    function nodeAppend(newNamespace, namespace) {
        return nodeAction(namespace, 'appendChild', newNamespace);
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
        if (!element.parentNode) {
            return 0;
        }
        return Array.prototype.indexOf.call(
            element.parentNode.children,
            element
        );
    }

    /**
     * Namespace object
     *
     * @constructor
     */
    function NamespaceString(namespace, index) {
        this.namespace = namespace;
        this.index = index || 0;
    };
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
    NamespaceString.prototype.next = function(index) {
        return new NamespaceNext(this, index);
    };

    /**
     * Generalisation of namespace
     *
     * @constructor
     */
    function NamespaceNext(namespace, index) {
        NamespaceString.call(this, namespace, index)
    };
    NamespaceNext.prototype = Object.create(NamespaceString.prototype);
    NamespaceNext.prototype.parent = function() {
        return this.namespace;
    };
    NamespaceNext.prototype.toString = function() {
        return this.namespace + '.children[' + this.index + ']';
    };


    /**
     * Calculate diff actions to make 'a' attributes the exactly the same as in 'b'
     *
     * @param {Element} a
     * @param {Element} b
     * @param {NamespaceString} namespaceA
     * @param {NamespaceString} namespaceB
     * @return {String}
     */
    function diffattributes(a, b, namespaceA, namespaceB) {
        var common, remove, create, result = '';

        // Calculate changes in attributes
        common = attrIntersection(a.attributes, b.attributes);
        remove = attrDifference(a.attributes, common);
        create = attrDifference(b.attributes, common);

        // Generate actions
        common.forEach(function(name) {
            if (!nodeAttrValueEqual(a, b, name)) {
                result += nodeAttrReplace(namespaceB, namespaceA, name);
            }
        });
        remove.forEach(function(name) {
            result += nodeAttrRemove(namespaceA, name);
        });
        create.forEach(function(name) {
            result += nodeAttrReplace(namespaceB, namespaceA, name);
        });

        return result;
    }

    /**
     * Create DOM API diff from given elements
     *
     * @param {Element} a
     * @param {Element} b
     * @return {Stirng}
     */
    function diff(rootA, rootB) {
        /**
         * Helper function
         *
         * @param {Element} a
         * @param {Element} b
         * @param {NamespaceString} namespaceA
         * @param {NamespaceString} namespaceB
         * @return {Stirng}
         */
        function diffrecursive(a, b, namespaceA, namespaceB) {
            var i, length, delta, isLeaf, isSame,
                result = '';

            isLeaf = nodeLeaf(a, b);
            isSame = nodeSame(a, b);

            // Node are the same so compare difference in attributes
            if (isSame) {
                result += diffattributes(a, b, namespaceA, namespaceB);
            }

            // Nodes are the same, compare children
            if (!isLeaf && isSame) {
                length = nodeLength(a);
                delta = length - nodeLength(b);

                // Create namespace for children
                namespaceA = namespaceA.next();
                namespaceB = namespaceB.next();

                if (delta > 0) {
                    // 'b' has leser length so we need to reduce
                    // 'a' loop length to 'b' length; if we haven't do this
                    // then we would have null elements in nodeB var
                    length -= delta;
                }

                for (i = 0; i < length; i++) {
                    result += diffrecursive(
                        nodeRetrieve(a, i),
                        nodeRetrieve(b, i),
                        namespaceA,
                        namespaceB
                    );

                    // Push namespace child further
                    namespaceA.push();
                    namespaceB.push();
                }

                if (delta > 0) {
                    // remove unused elements form 'a' node
                    do {
                        // We use the same 'path' for removed elements because
                        // When removing elementa at index 1, element at index 2 changes its possition
                        // and became element at position 1
                        result += nodeRemove(namespaceA);
                    } while(--delta > 0);
                } else if (delta < 0) {
                    // the 'a' node have less children than the 'b' node
                    // then since we compare all common 'a' and 'b' nodes
                    // then we need add remaining 'b' nodes
                    do {
                        result += nodeAppend(
                            namespaceB,
                            namespaceA.parent()
                        );
                    } while(++delta < 0);
                }
            }
            // No relation, use b remove a
            else if (!nodeExactly(a, b)){
                result += nodeReplace(
                    namespaceB,
                    namespaceA
                );

                // When we replace element A with B then B's children number decremented
                namespaceB.pop();
            }

            return result;
        }


        // Perform two node comparision
        return diffrecursive(
            rootA,
            rootB,
            new NamespaceString('aElement'),
            new NamespaceString('bElement')
        );
    }

    function applyDiff(a, b, diff) {
        return new Function('aElement', 'bElement', diff)(a, b);
    }

    var exports = {};

    exports.diff = diff;
    exports.applyDiff = applyDiff;
    exports.attrDifference = attrDifference;
    exports.attrIntersection = attrIntersection;
    exports.nodeSame = nodeSame;
    exports.nodeLeaf = nodeLeaf;
    exports.nodeExactly = nodeExactly;
    exports.nodePosition = nodePosition;
    exports.NamespaceString = NamespaceString;
    exports.NamespaceNext = NamespaceNext;

    return exports;
});

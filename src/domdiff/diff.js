define([
   './NamespaceString',
   './nodeLeaf',
   './nodeSame',
   './diffAttributes',
   './nodeLength',
   './nodeRetrieve',
   './nodeRemove',
   './nodeAppend',
   './nodeReplace',
   './nodeExactly'
], function(
    NamespaceString,
    nodeLeaf,
    nodeSame,
    diffAttributes,
    nodeLength,
    nodeRetrieve,
    nodeRemove,
    nodeAppend,
    nodeReplace,
    nodeExactly
) {
    'use strict';

    /**
     * Create DOM API diff from given elements
     *
     * @param {Element} a
     * @param {Element} b
     * @return {String}
     */
    return function diff(rootA, rootB) {
        /**
         * Helper function
         *
         * @param {Element} a
         * @param {Element} b
         * @param {NamespaceString} namespaceA
         * @param {NamespaceString} namespaceB
         * @return {string}
         */
        function diffRecursive(a, b, namespaceA, namespaceB) {
            var i, length, delta, isLeaf, isSame,
                result = '';

            isLeaf = nodeLeaf(a, b);
            isSame = nodeSame(a, b);

            // Node are the same so compare difference in attributes
            // Add attributes only for element type nodes
            if (isSame && a.nodeType === 1) {
                result += diffAttributes(a, b, namespaceA, namespaceB);
            }

            // Nodes are the same, compare children
            if (!isLeaf && isSame) {
                length = nodeLength(a);
                delta = length - nodeLength(b);

                // Create namespace for children
                namespaceA = namespaceA.next();
                namespaceB = namespaceB.next();

                if (delta > 0) {
                    // 'b' has lesser length so we need to reduce
                    // 'a' loop length to 'b' length; if we haven't do this
                    // then we would have null elements in nodeB var
                    length -= delta;
                }

                for (i = 0; i < length; i++) {
                    result += diffRecursive(
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
                        // When removing element at index 1, element at index 2 changes its possition
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


        // Perform two node comparison
        return diffRecursive(
            rootA,
            rootB,
            new NamespaceString('aElement'),
            new NamespaceString('bElement')
        );
    }
});

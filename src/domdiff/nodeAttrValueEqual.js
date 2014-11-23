define(function() {
    'use strict';

    /**
     * Helper function, testing if attribute is the same in two given elements.
     *
     * @param {Element} a
     * @param {Element} b
     * @param {String} name
     * @return {Boolean}
     */
    return function nodeAttrValueEqual(a, b, name) {
        return a.attributes[name].value === b.attributes[name].value;
    }
});

define([
    '../monad/unit',
    '../functional/each',
    '../functional/is',
    '../functional/isArray',
    '../functional/isObject'
], function(unit, each, is, isArray, isObject) {
    'use strict';

    function elGet(el) {
        return el;
    }

    /**
     * Create monad which contains DOMElement.
     *
     * @param {String} name
     * @returns {Function}
     */
    function elFromName(name) {
        return unit(document.createElement(name));
    }

    /**
     * Inject element attributes if given value is an Hash.
     *
     * @param {Object} attributes
     * @returns {Function}
     */
    function elAttributes(attributes) {
        if (!isObject(attributes)) {
            return unit;
        }

        return function elInjectAttributes(el) {
            each(attributes, function(value, name) {
                el.setAttribute(name, value);
            });

            return unit(el);
        };
    }

    /**
     * Inject children if given value is array
     *
     * @param {Array} children
     * @returns {Function}
     */
    function elChildren(children) {
        if (!isArray(children)) {
            return unit;
        }

        return function elInjectChildren(el) {
            each(children, function(child) {
                el.appendChild(child);
            });

            return unit(el);
        };
    }

    /**
     * Inject text content to element if text is an string.
     *
     * @param {String} text
     * @returns {Function}
     */
    function elTextContent(text) {
        if (!is('String', text) && !is('Number', text)) {
            return unit;
        }

        return function elInjectTextContent(el) {
            el.textContent = text;

            return unit(el);
        };
    }

    /**
     * DOM element factory.
     *
     * @param {String} name
     * @param {Object|Array|String} attributesOrChildren
     * @param {Array|String} [children]
     * @return {Element}
     */
    return function el(name, attributesOrChildren, children) {
        var result = name instanceof Element
            ? unit(name)
            : elFromName(name);

        if (isObject(attributesOrChildren)) {
            result = result.bind(elAttributes(attributesOrChildren));
            result = result.bind(elChildren(children));
            result = result.bind(elTextContent(children));
        } else {
            result = result.bind(elChildren(attributesOrChildren));
            result = result.bind(elTextContent(children));
        }

        return result.bind(elGet);
    };
});

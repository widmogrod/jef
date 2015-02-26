define(['../functional/isArray'], function (isArray) {
    'use strict';

    function find(selector, scope) {
        var list, element;

        switch(selector.charAt(0)) {
            case '#':
                element = document.getElementById(selector.slice(1));
                list = [element];
                break;

            case '.':
                element = document.getElementsByClassName(selector.slice(1));
                list = [element];
                break;

            default:
                element = list = (scope || document).querySelectorAll(selector);

        }

        return {
            element: element,
            list: list
        };
    }

    function normalizeSelector(selector) {
        return isArray(selector)
            ? selector
            : selector.replace('  ', ' ').split(' ');
    }

    return function selector(cssSelector, scope) {
        var path = normalizeSelector(cssSelector),
            found = find(path[0], scope);

        if (path.length > 1) {
            return selector(
                path.slice(1),
                found.element
            );
        }

        return {
            length: found.list.length,
            get: function(index) {
                return arguments.length
                    ? found.list[index]
                    : found.list;
            }
        };
    };
});

/*Global:Element*/
define(function() {
    'use strict';

    var elementProto = Element.prototype;
    var matchesSelector = elementProto.mozMatchesSelector
        || elementProto.webkitMatchesSelector
        || elementProto.oMatchesSelector
        || elementProto.msMatchesSelector;

    return function eventEmitter(element) {
        return {
            on: function on(event, selector, fn) {
                element.addEventListener(event, function(e) {
                    if (matchesSelector.call(e.target, selector)) {
                        fn.call(e.target, e);
                    }
                }, false);
            }
        };
    };
});

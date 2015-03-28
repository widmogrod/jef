define(function() {
    'use strict';

    var int = parseInt;

    return function position(element) {
        var x = 0;
        var y = 0;

        while (element) {
            x += (int(element.offsetLeft) - int(element.scrollLeft) + int(element.clientLeft >> 0));
            y += (int(element.offsetTop) - int(element.scrollTop) + int(element.clientTop >> 0));
            element = element.offsetParent;
        }

        return {x: x, y: y};
    };
});

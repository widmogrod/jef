(function(root, factory) {
    root.jefdemo = root.jefdemo || {};
    root.jefdemo.domdiff = factory(
        jQuery
    );
})(this, function(jQuery) {
    'use strict';

    function update($first, $second, $el) {
        return function() {
            var diff = $('<div/>')
                .html($first.val())
                .diffhtml($second.val(), {returnDiff: true});
            $el.html(diff[0]).append(
                $('<div/>')
                    .html($first.val())
                    .diffhtml($second.val())
            );
        }
    }

    return {
        main: function(first, second, diff) {
            var $first = $(first);
            var $second = $(second);
            var $diff = $(diff);

            $first.on('change', update($first, $second, $diff));
            $second.on('change', update($first, $second, $diff));
        }
    };
});

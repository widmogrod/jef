(function(root, factory) {
    root.jefdemo = root.jefdemo || {};
    root.jefdemo.domdiff = factory(
        jQuery
    );
})(this, function(jQuery){
    'use strict';

    var ENTER = 13;
    var data = {
        name: 'guest',
        rows:[]
    };

    return {
        main: function(element, document, template) {
            var $el = $(element);

            $el.diffhtml(template(data), {debug: true});
            $el.on('keyup', function(e) {
                var $el = $(e.target);
                if (e.keyCode === ENTER) {
                    data.rows.push({
                        comment: $el.val()
                    })
                    $el.val(null);
                    $el.trigger('render');
                }
            });
            $el.on('render', function() {
                $el.diffhtml(template(data), {debug: true});
            })
        }
    };
});

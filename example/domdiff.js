(function(root, factory) {
    if (typeof exports === 'object') { // Node.js
        module.exports = factory(
            require('../integration/jquery.domdiff.js')
        );
    } else if (typeof define === 'function' && define.amd) { // Require.JS
        define(['jef/integration/jquery.domdiff'], factory);
    } else {  // Browser globals
        root.jefdemo = root.jefdemo || {};
        root.jefdemo.domdiff = factory(
            jQuery
        );
    }
})(this, function(jQuery){
    'use strict';

    var dataA = {
        rows:[
            {name: "Adam", 'class': 'red'}
        ]
    };
    var dataB = {
        rows:[
            {name: "Adam", 'class': 'blue'},
            {name: "Barbara", 'class': 'blue'},
            {name: "John", 'class': 'blue'}
        ]
    };

    return {
        main: function(element, document, template) {
            $(element).diffhtml(template(dataA));
            $('#js-render').on('click', function() {
                $(element).diffhtml(template(dataB));
            });
        }
    };
});

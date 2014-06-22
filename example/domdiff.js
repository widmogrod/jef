(function(root, factory) {
    if (typeof exports === 'object') { // Node.js
        module.exports = factory(
            require('../domdiff.js')
        );
    } else if (typeof define === 'function' && define.amd) { // Require.JS
        define(['jef/domdiff'], factory);
    } else {  // Browser globals
        root.jefdemo = root.jefdemo || {};
        root.jefdemo.domdiff = factory(
            root.jef.domdiff
        );
    }
})(this, function(domdiff){
    'use strict';

    jQuery.fn.dhtml = function(html) {
        var ref, diff, func;

        ref = document.createElement('div');
        return this.each(function() {
            // Create in memory dom nodes
            ref.innerHTML = html;
            // Compare document state with memory state
            diff = domdiff.diff(this, ref);
            // Create function to apply difference
            func = new Function('aElement', 'bElement', diff)
            // Apply difference
            func(this, ref);
        });
    }

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
            $(element).dhtml(template(dataA));
            $('#js-render').on('click', function() {
                $(element).dhtml(template(dataB));
            });
        }
    };
});

(function(root, factory) {
    if (typeof exports === 'object') { // Node.js
        module.exports = factory(
            require('../functional.js'),
            require('../reactive.js')
        );
    } else if (typeof define === 'function' && define.amd) { // Require.JS
        define(['jef/functional', 'jef/reactive'], factory);
    } else {  // Browser globals
        root.jefdemo = root.jefdemo || {};
        root.jefdemo.reactive_excel = factory(
            root.jef.functional,
            root.jef.reactive,
            root
        );
    }
})(this, function(f, r, root){
    'use strict';

    root.node_set_text = function(node, value) {
        node.innerText = value();
    }

    root.ADD = function (a, b) {
       return parseInt(a()) + parseInt(b());
    }

    return {
        main: function(element, document) {

            var value, key, vars = root;
            var names = '#ABCDEFGHIJ';
            var tr, td, label, result, input;
            var cols = 5;
            var rows = 5;

            // columns
            tr = document.createElement('tr');
            for (var j = 0; j < cols; j++) {
                td = document.createElement('td');
                td.innerText = names.charAt(j);
                tr.appendChild(td);
            }
            element.appendChild(tr);

            // rows
            for (var i = 1; i < rows; i++) {
                tr = document.createElement('tr');

                td = document.createElement('td');
                td.innerText = i;
                tr.appendChild(td);


                for (var j = 1; j < cols; j++) {
                    td = document.createElement('td');
                    input = document.createElement('input');
                    result = document.createElement('pre');

                    td.appendChild(input);
                    td.appendChild(result);
                    tr.appendChild(td);

                    value = r.value(i.j)
                    value = r.observable(value, node_set_text.bind(null, result, value));

                    key = names.charAt(j) + i;
                    vars[key] = value;

                    input.onchange = (function(value, result, key) {
                        return function() {
                            if (this.value > 0) {
                                vars[key](this.value);
                            } else {
                                // extract variables that must be observed
                                var funcName = this.value.replace('=','');
                                var v = funcName.match(/\w\d/g);
                                var b = 'with(vars) { value(' + funcName + ') }';
                                var fn = new Function('vars', 'value', b);
                                fn = fn.bind(fn, vars, vars[key]);

                                f.each(v, function(name) {
                                    vars[name] = r.observable(vars[name], fn);
                                });

                                fn();
                            }
                        }
                    })(value, result, key);
                }
                element.appendChild(tr);
            }
        }
    };
});

(function(root, factory) {
    if (typeof exports === 'object') { // Node.js
        module.exports = factory(
            require('../functional.js'),
            require('../reactive.js')
        );
    } else if (typeof define === 'function' && define.amd) { // Require.JS
        define(['../src/functional.js', '../src/reactive'], factory);
    } else {  // Browser globals
        root.jefdemo = root.jefdemo || {};
        root.jefdemo.reactive_excel = factory(
            root.jef.functional,
            root.jef.reactive
        );
    }
})(this, function(f, r){
    'use strict';

    function node_set_text(node, value) {
        node.innerText = value();
    }
    function extract_function_name(value) {
        return value.match(/[a-z]+/i)[0].toUpperCase();
    }
    function extract_function_arguments(value) {
        return value.match(/[a-z]{1,2}[0-9]{1,2}/ig) || [];
    }
    function build_excel_function(name, args) {
        return new Function(
            'functions',
            'variables',
            'value',
            'value(functions["' + name + '"](variables["'+ args.join('"], variables["') +'"]))'
        );
    }

    var baseOptions = {
        functions: {},
        columns: '#ABCDEFGHIJ',
        rows: 5
    };

    return {
        main: function(element, document, options) {
            options = f.merge(baseOptions, options);

            var tr, td, label, result, input, cellName,
                sharedVariables = {},
                sharedFunctions = {},
                cols = options.columns.length,
                rows = options.rows;

            // Build columns
            tr = document.createElement('tr');
            for (var j = 0; j < cols; j++) {
                td = document.createElement('td');
                td.innerText = options.columns.charAt(j);
                tr.appendChild(td);
            }
            element.appendChild(tr);

            // Build rows
            for (var i = 1; i < rows; i++) {
                tr = document.createElement('tr');

                td = document.createElement('td');
                td.innerText = i;
                tr.appendChild(td);

                // Build cells
                for (var j = 1; j < cols; j++) {
                    td = document.createElement('td');
                    input = document.createElement('input');
                    result = document.createElement('pre');

                    td.appendChild(input);
                    td.appendChild(result);
                    tr.appendChild(td);

                    cellName = options.columns.charAt(j) + i;
                    sharedVariables[cellName] = r.value(cellName)
                    sharedVariables[cellName] = r.observable(sharedVariables[cellName], node_set_text.bind(null, result, sharedVariables[cellName]));

                    input.onchange = (function(cellName) {
                        return function() {
                            if (this.value > 0) {
                                sharedVariables[cellName](this.value);
                            } else if(!this.value) {
                                sharedVariables[cellName](null);
                            } else {
                                sharedFunctions[cellName] = build_excel_function(
                                    extract_function_name(this.value),
                                    extract_function_arguments(this.value)
                                );

                                f.each(extract_function_arguments(this.value), function(variableName) {
                                    sharedVariables[variableName] = r.observable(sharedVariables[variableName], function() {
                                        if (cellName in sharedFunctions) {
                                            sharedFunctions[cellName](options.functions, sharedVariables, sharedVariables[cellName]);
                                        }
                                    });
                                });

                                sharedFunctions[cellName](options.functions, sharedVariables, sharedVariables[cellName]);
                            }
                        }
                    })(cellName);
                }
                element.appendChild(tr);
            }
        }
    };
});

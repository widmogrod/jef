(function(root, factory) {
    if (typeof exports === 'object') { // Node.js
        module.exports = factory(
            require('../functional.js'),
            require('../stream.js')
        );
    } else if (typeof define === 'function' && define.amd) { // Require.JS
        define(['jef/stream', 'jef/reactive'], factory);
    } else {  // Browser globals
        root.jefdemo = root.jefdemo || {};
        root.jefdemo.stream_excel = factory(
            root.jef.functional,
            root.jef.stream
        );
    }
})(this, function(f, stream){
    'use strict';

    function extract_function_name(value) {
        return value.match(/[a-z]+/i)[0].toUpperCase();
    }
    function extract_function_arguments(value) {
        return value.match(/[a-z]{1,2}[0-9]{1,2}/ig) || [];
    }
    function build_excel_function(name, args) {
        return new Function(
            'functions',
            'streams',
            'cellName',
            // Merge steams into one stream
            'return jef.stream.when(streams["'+ args.join('"], streams["') +'"])'
                   // for last merged values in stream (if any)
                + '.last(function() {'
                    // apply function and set this value for given cellName
                    + 'streams[cellName].push('
                        + 'functions["' + name + '"].apply(null, arguments)'
                    + ');'
                +'});'
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
                streams = {},
                sharedResults = {},
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
                    streams[cellName] = new stream();
                    streams[cellName].on('data', function(value) {
                         this.innerText = value;
                    }.bind(result));

                    input.onchange = (function(cellName) {
                        return function() {
                            if (cellName in sharedResults) {
                                sharedResults[cellName].destroy();
                            }

                            if (this.value > 0) {
                                streams[cellName].push(this.value);
                            } else if(!this.value) {
                                streams[cellName].push(null);
                            } else {
                                sharedFunctions[cellName] = build_excel_function(
                                    extract_function_name(this.value),
                                    extract_function_arguments(this.value)
                                );

                                sharedResults[cellName] = sharedFunctions[cellName](
                                    options.functions,
                                    streams,
                                    cellName
                                );
                            }
                        }
                    })(cellName);
                }
                element.appendChild(tr);
            }
        }
    };
});

/**
 * Build vanilla package, no AMD requirement and export it to window.jef
 *
 * @param data
 */
function onModuleBundleComplete(data) {
    var fs = require('fs'),
        amdclean = require('amdclean'),
        outputFile = data.path;

    fs.writeFileSync(outputFile, amdclean.clean({
        filePath: outputFile,
        wrap: {
            'end': 'window.jef = window.jef || {}; window.jef.' + data.name + ' = ' + data.name + '; \n}());'
        }
    }));
}

/**
 * Innervation build with jQuery doesn't need to export to global variable
 * Because jquery is already global, and we registering to it.
 *
 * @param data
 */
function onModuleBundleCompleteNoGlobal(data) {
    var fs = require('fs'),
        amdclean = require('amdclean'),
        outputFile = data.path;

    fs.writeFileSync(outputFile, amdclean.clean({
        filePath: outputFile
    }));
}

/**
 * Prepare configuration for requirejs.
 *
 * @param {String} name
 * @param {Array} include
 * @param {Boolean} global
 * @returns {{options: {baseUrl: string, optimize: string, name: *, include: number, out: string, onModuleBundleComplete: onModuleBundleCompleteNoGlobal}}}
 */
function packageFor(name, include, global) {
    include = include | [name];
    return {
        options: {
            baseUrl: './src',
            optimize: 'none',
            name: name,
            include: include,
            out: 'dist/'+ name +'.min.js',
            onModuleBundleComplete: global ? onModuleBundleCompleteNoGlobal : onModuleBundleComplete
        }
    }
}

module.exports = packageFor;

var packageFor = require('./build/packageFor');

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                preserveComments: false
            },
            vanilla: {
                files: {
                    'dist/functional.min.js': ['dist/functional.min.js'],
                    'dist/stream.min.js': ['dist/stream.min.js'],
                    'dist/mathematical.min.js': ['dist/mathematical.min.js'],
                    'dist/events.min.js': ['dist/events.min.js'],
                    'dist/integration/jquery.streamOn.min.js': ['dist/integration/jquery.streamOn.min.js'],
                    'dist/integration/jquery.diffhtml.min.js': ['dist/integration/jquery.diffhtml.min.js']
                }
            }
        },
        requirejs: {
            functional: packageFor('functional'),
            stream: packageFor('stream'),
            mathematical: packageFor('mathematical'),
            events: packageFor('events'),
            domdiff: packageFor('domdiff'),
            reactive: packageFor('reactive'),
            jqueryStream: packageFor('integration/jquery.streamOn', ['stream'], true),
            jqueryDiffHtml: packageFor('integration/jquery.diffhtml', ['diffhtml'], true)
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    // Default task(s).
    grunt.registerTask('build', [
        // Vanilla - main packages
        'requirejs:functional',
        'requirejs:stream',
        'requirejs:mathematical',
        'requirejs:events',
        'requirejs:reactive',
        // Vanilla - integration
        'requirejs:jqueryStream',
        'requirejs:jqueryDiffHtml',
        // Uglify
        'uglify:vanilla'
    ]);
};

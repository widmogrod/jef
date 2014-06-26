module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                preserveComments: false
            },
            single: {
                files: {
                    'dist/functional.min.js': ['functional.js'],
                    'dist/mathematical.min.js': ['mathematical.js'],
                    'dist/domdiff.min.js': ['domdiff.js'],
                    'dist/events.min.js': ['events.js'],
                    'dist/stream.min.js': ['stream.js'],
                    'dist/reactive.min.js': ['reactive.js']
                }
            },
            integration: {
                 options: {
                    banner: '/*! jquery.diffhtml <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                    preserveComments: false
                },
                files: {
                    'dist/integration/jquery.diffhtml.min.js': ['domdiff.js', 'integration/jquery.diffhtml.js'],
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('build', ['uglify:single', 'uglify:integration']);

};

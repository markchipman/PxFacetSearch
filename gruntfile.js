/*global module:true, require: true */

module.exports = function(grunt) {

    // banners for JS and HTML
    var bannerTemplate = '<%= pkg.name %> | <%= pkg.homepage %> | <%= grunt.template.today("yyyy-mm-dd") %>',
        jsBanner = '/*! ' + bannerTemplate + ' */\n',
        htmlBanner = '<!-- ' + bannerTemplate + ' -->\n';

    // project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            app: {
                options: {
                    banner: '(function(){\n',
                    footer: '\n})();'
                },
                src: [
                    'js/polyfills.js',
                    'js/namespace.js',
                    'js/utils.js',
                    'js/Column.js',
                    'js/CategoryColumn.js',
                    'js/CategoryFilter.js',
                    'js/CategorySelector.js',
                    'js/CategorySelectorUI.js',
                    'js/Query.js',
                    'js/Table.js',
                    'js/View.js',
                ],
                dest: 'PxFacetSearch.js'
            }
        },
        jshint: {
            // js hint
            options: {
                curly: false,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                browser: true,
                smarttabs: true,
                es5: true,
                onecase: true,
                globals: {
                    console: true,
                    module: true,
                    PxFacetSearch: true
                }
            },
            all: [
                'Gruntfile.js',
                'js/**/*.js'
            ]
        },
        uglify: {
            includeBanner: {
                options: {
                    banner: jsBanner
                },
                files: {
                    '<%= concat.app.dest %>': ['<%= concat.app.dest %>']
                }
            }
        },
        watch: {
            files: [
                'Gruntfile.js',
                'js/**/*.js'
            ],
            tasks: ['default']
        }
    });

    // load plugins
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    
    grunt.registerTask('debug', [
        'jshint',
        'concat'
    ]);
    
    grunt.registerTask('ship', [
        'debug',
        'uglify'
    ]);

    grunt.registerTask('default', 'debug');
    
};

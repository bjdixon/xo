module.exports = function(grunt) {
    grunt.initConfig({
        jshint: {
            files: ['src/xo.js', 'test/xo.spec.js'],
            options: {
                jshintrc: true
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint']
        },
        uglify: {
            options: {
                screwIE8: true
            },
            my_target: {
                files: {
                    'dist/xo.min.js': ['src/xo.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['jshint', 'uglify']);
    grunt.registerTask('lint', ['jshint']);
    grunt.registerTask('build', ['uglify']);

};


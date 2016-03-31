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
        babel: {
            options: {
                sourceMap: true,
                presets: ['es2015']
            },
            dist: {
                files: {
                    'dist/xo.js': 'src/xo.js'
                }
            }
        },
        uglify: {
            options: {
                screwIE8: true
            },
            my_target: {
                files: {
                    'dist/xo.min.js': ['dist/xo.js']
                }
            }
        },
        jasmine: {
          coverage: {
              src: ['src/xo.js'],
              options: {
                  specs: ['test/xo.spec.js'],
                  template: require('grunt-template-jasmine-istanbul'),
                  templateOptions: {
                      coverage: 'bin/coverage/coverage.json',
                      report: [{ type: 'text-summary' }],
                      thresholds: {
                          lines: 75,
                          statements: 75,
                          branches: 75,
                          functions: 90
                      }
                  },
                  vendor: [
                    'src/xo.js'
                  ]
              }
          }
      },
      jsdoc : {
          dist : {
              src: ['src/xo.js'],
              options: {
                  destination: 'doc',
                  template: 'node_modules/ink-docstrap/template',
                  readme: 'doc/intro.html',
                  configure: 'node_modules/ink-docstrap/template/jsdoc.conf.json'
              }
          }
      }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-babel');

    grunt.registerTask('default', ['jshint', 'uglify']);
    grunt.registerTask('lint', ['jshint']);
    grunt.registerTask('coverage', ['jasmine:coverage']);
    grunt.registerTask('docs', ['jsdoc']);
    grunt.registerTask('build', ['jshint', 'babel', 'uglify']);

};


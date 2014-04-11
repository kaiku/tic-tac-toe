module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'examples/src/**/*.js'],
      options: {
        globals: {
          jQuery: true,
          console: true
        }
      }
    },
    copy: {
      examples: {
        files: [
          {
            expand: true,
            flatten: true,
            src: [
              'bower_components/bootstrap/dist/css/bootstrap.min.css',
              'bower_components/bootstrap/dist/js/bootstrap.min.js',
              'bower_components/jquery/dist/jquery.min.js'
            ],
            dest: 'examples/vendor',
            filter: 'isFile'
          },
          {
            src: 'src/ttt.js',
            dest: 'examples/src/ttt.js'
          }
        ]
      }
    },
    watch: {
      files: ['src/*'],
      tasks: ['copy']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jshint', 'copy']);
};

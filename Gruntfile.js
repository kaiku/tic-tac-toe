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
            src: 'src/ttt.js',
            dest: 'examples/assets/ttt.js'
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

/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;' +
      ' Licensed <%= pkg.license %> */\n',
    // Task configuration.
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['src/lib/Detector.js', 'src/valiant.jquery.js'],
        dest: 'build/<%= pkg.name %>.js'
      }
    },
    copy: {
      build: {
        files: [
          { expand: true, cwd: 'src/css/fonts/', src: ["*"], dest: "build/css/fonts/" }
        ]
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['lib/**/*.js', 'test/**/*.js']
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    requirejs: {
      compile: {
        options: {
          baseUrl: "src/",
          mainConfigFile: "src/main.js",
          name: "main", // assumes a production build using almond
          out: "demo/valiant360.min.js"
        }
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['jshint:lib_test', 'qunit']
      },
      main_css: {
        files: 'src/css/*.less',
        tasks: ['less']
      },
      dev_css: {
        files: 'src/valiant.jquery.js',
        tasks: 'concat'
      }
    },
    rsync: {
      options: {
          args: ["--progress"],
          exclude: [".git*","*.scss","node_modules"],
          recursive: true
      },
      demo: {
        options: {
          src: "build/demo/",
          dest: "../flimshaw.github.io/Valiant360/demo"
        }
      }
    },
    less: {
      development: {
        options: {
          paths: ["src/css"],
          cleancss: true 
        },
        files: {
          "build/css/valiant360.css": "src/css/valiant360.less"
        }
      },
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-rsync');
  grunt.loadNpmTasks('grunt-bump');

  // Default task.
  grunt.registerTask('default', ['jshint', 'less']);
  grunt.registerTask('build', ['default', 'copy:build', 'concat', 'uglify']);

};

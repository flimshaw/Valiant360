/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
      ' <%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;' +
      ' Licensed <%= pkg.license %> */\n\n',
    // Task configuration.
    concat: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: ['src/lib/Detector.js', 'src/valiant.jquery.js'],
        dest: 'build/<%= pkg.name %>.js'
      }
    },
    copy: {
      build: {
        files: [
          { expand: true, cwd: 'src/css/fonts/', src: ["*"], dest: "build/css/fonts/" },
          { expand: true, cwd: 'demo/js', src: ["three.min.js", "jquery-1.7.2.min.js"], dest: "build/js" },
          { src: ['README.md'], dest: "build/README.md" }
        ]
      },
      to_site: {
        files: [
          { expand: true, cwd: 'build/', src: ["**"], dest: "../flimshaw.github.io/Valiant360/build" },
          { expand: true, cwd: 'dist/', src: ["<%= pkg.name %>_<%= pkg.version %>.zip"], dest: "../flimshaw.github.io/Valiant360/download/" }
        ]
      }
    },
    bump: {
      options: {
        commit: false,
        push: false
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
        laxcomma: true,
        multistr: true,
        browser: true,
        globals: {
          jQuery: true,
          console: true,
          THREE: true,
          Detector: true,
          requestAnimationFrame: true
        }
      },
      lib: {
        src: 'src/valiantRefactor.js'
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
      dev_js: {
        files: ['src/valiant.jquery.js', 'src/valiantRefactor.js'],
        tasks: ['jshint:lib', 'concat']
      }
    },
    // gzip assets 1-to-1 for production
    compress: {
      main: {
        options: {
          archive: 'dist/<%= pkg.name %>_<%= pkg.version %>.zip'
        },
        files: [
          { expand: true, cwd: 'build/', src: ['**/*'], dest: './valiant360' }
        ]
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
  grunt.loadNpmTasks('grunt-contrib-compress');
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
  grunt.registerTask('deploy', ['default', 'copy:build', 'concat', 'uglify', 'compress', 'copy:to_site']);

};

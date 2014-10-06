
module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        //=====================================
        //== Run blocking tasks concurrently ==
        //=====================================
        concurrent: {
            //== Automate the dev environment
            dev: {
                options: {
                    logConcurrentOutput: true
                },
                tasks: ['watch', 'nodemon:dev']
            }
        },

        //======================
        //== Node app control ==
        //======================
        nodemon: {
            //== Monitor the dev Node app for Node file updates
            dev: {
                script: './bin/www',
                options: {
                    ignore: [ '.git/**/*',
                              'node_modules/**/*',
                              'client/**/*',
                              'Gruntfile.js',
                              'npm_debug.log',
                              'README.md'
                            ]
                }
            }
        },

        //=================
        //== Watch files ==
        //=================
        watch: {
            //== Rebuild the CSS min file after CSS edits
            css: {
                files: ['client/public/dev/css/*.css', 'client/public/dev/css/less/*.less'],
                tasks: ['concat:css', 'cssmin'],
                options: {
                    spawn: true
                }
            },
            //== Rebuild the JS min file after JS edits
            js: {
                files: ['client/public/dev/js/*.js'],
                tasks: ['concat:js', 'uglify'],
                options: {
                    spawn: true
                }
            },
            livereload: {
                options: { livereload: true },
                files: ['client/public/build/**/*', 'client/views/*.ejs', 'client/views/*.html']
            }
        },

        //========================
        //== File concatination ==
        //========================
        concat: {
            //== Concat the CSS files
            css: {
                src: [
                    'client/public/dev/css/bootstrap.css',
                    'client/public/dev/css/style.css',
                    'client/public/dev/css/style-mq.css'
                ],
                dest: 'client/public/build/css/application.css'
            },
            //== Concat the JS files
            js: {
                src: [
                    'client/public/dev/js/jquery.js',
                    'client/public/dev/js/bootstrap.js',
                    'client/public/dev/js/socket.io.js',
                    'client/public/dev/js/custom.js'
                ],
                dest: 'client/public/build/js/application.js'
            }
        },

        //======================
        //== CSS minification ==
        //======================
        cssmin: {
            minify: {
                expand: true,
                flatten: true,
                cwd:   'client/public/build/css/',
                src:  ['application.css'],
                dest:  'client/public/build/css/',
                ext:   '.min.css'
            }
        },

        //=============================
        //== Javascript minification ==
        //=============================
        uglify: {
            build: {
                src:  'client/public/build/js/application.js',
                dest: 'client/public/build/js/application.min.js'
            }
        },

    });

    //=============================
    //== Load Grunt NPM packages ==
    //=============================
    require('load-grunt-tasks')(grunt);

    //====================
    //== Register tasks ==
    //====================
    //== Default task
    grunt.registerTask('default', ['']);
    //== Dev task
    grunt.registerTask('dev', ['concurrent:dev']);
    
};
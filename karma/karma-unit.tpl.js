module.exports = function ( karma ) {
  karma.set({
    /** 
     * From where to look for files, starting with the location of this file.
     */
    basePath: '../',

    /**
     * This is the list of file patterns to load into the browser during testing.
     */
    files: [
      <% scripts.forEach( function ( file ) { %>'<%= file %>',
      <% }); %>
      'src/**/*.js',
      'test/**/*.mocha.js'
    ],
    exclude: [
      'src/assets/**/*.js'
    ],
    frameworks: [ 'mocha', 'chai', 'chai-sinon' ],
    plugins: [ 'karma-mocha', 'karma-chai', 'karma-chai-sinon', 'karma-phantomjs-launcher', 'karma-firefox-launcher', 'karma-coverage' ],
    preprocessors: {
      'src/**/*.js': ['coverage']
    },

    /**
     * How to report, by default.
     */
    reporters: ['dots', 'coverage'],

    /**
     * On which port should the browser connect, on which port is the test runner
     * operating, and what is the URL path for the browser to use.
     */
    port: 9018,
    runnerPort: 9100,
    urlRoot: '/',

    /** 
     * Disable file watching by default.
     */
    autoWatch: false,

    /**
     * The list of browsers to launch to test on.
     */
    browsers: [
      'PhantomJS'
    ]
  });
};


require.config( {
  baseUrl: "./js",
  paths: {
    vendor: "../vendor",
    jquery: "../vendor/jquery/jquery-2.2.0.min"
  },
  packages: [ {
    name: "codemirror",
    location: "../vendor/codemirror",
    main: "lib/codemirror"
  } ]
} );

require( [
  "app",
  "vendor/requirejs/domReady",
  "commander.mode"
], function ( App, domReady ) {
  domReady( function () {
    window.app = new App;
  } );
} );
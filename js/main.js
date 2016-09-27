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
  "editor/commander-mode",
  "editor/commander-hint",
  "codemirror/addon/edit/matchbrackets"
], function ( App, domReady ) {
  domReady( function () {
    window.app = new App;
  } );
} );
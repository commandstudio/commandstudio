define( [ "ui", "compiler" ], function( UI, Compiler ) {

  function App() {
    this.ui = new UI();
    this.compiler = new Compiler();

    this.options = { useOldEntityNames: true };
    this.loadOptions();

    var projectSave = this.load( "commandstudio-project" );
    if( projectSave !== null ) {
      this.ui.setFiles( projectSave );
    } else {
      this.ui.newFile( "new_file" );
    }

    this.initEvents();
  }

  App.prototype.initEvents = function() {
    var app = this,
      ui = this.ui,
      compiler = this.compiler;

    ui.events.on( "toolbar.file-compile", function() {
      compiler.setFiles( ui.getFiles() );
      try {
        var command = compiler.compile( ui.selectedFile, app.options );
        ui.setOutput( command );
        ui.selectOutput();
      } catch( exception ) {
        ui.setOutput( command );
      }
    } );

    ui.events.on( "toolbar.project-export", function() {
      var project = {
          version: "0.1",
          files: ui.getFiles()
        },
        link = "data:application/json," + encodeURI( JSON.stringify( project ) );

      ui.popin.show( "download", {
        "title": "Export project",
        "text": "Download your project",
        "link:href": link,
        "link:download": "project.json"
      } );
    } );

    ui.events.on( "toolbar.project-new", function() {
      ui.popin.confirm( {
        "title": "Warning",
        "text": "Creating a new project will erase any unsaved change. Are you sure you want to do this?",
        "action:confirm": function() {
          ui.resetFiles();
        }
      } );
    } );

    ui.events.on( "toolbar.project-import", function() {
      ui.popin.confirm( {
        "title": "Warning",
        "text": "Importing a new project will erase any unsaved change. Are you sure you want to do this?",
        "action:confirm": function() {
          ui.promptFile( function() {
            var file = this.files[0],
              fr = new FileReader();
            fr.onloadend = function( event ) {
              try {
                var project = JSON.parse( event.target.result );
                if( project.version === "0.1" && typeof project.files === "object" ) {
                  ui.setFiles( project.files );
                }
                else {
                  throw "Invalid JSON project format";
                }
              }
              catch( e ) {
                ui.popin.show( "alert", {
                  "title": "Error",
                  "text": "Invalid file format"
                } );
              }
            };
            fr.readAsText( file );
          } );
        }
      } );
    } );

    ui.events.on( "toolbar.app-about", function() {
      ui.popin.show( "about" );
    } );

    ui.events.on( "toolbar.app-options", function() {

      ui.popin.show( "options", {
        "action:save": function() {
          app.options.useOldEntityNames = this.$popin.find( "#option-useOldEntityNames" ).prop( "checked" );
          app.saveOptions();
          this.hide();
        }
      } );

      for( var optionName in app.options ) {
        if( app.options[optionName] === true ) {
          ui.popin.$popin.find( "#option-" + optionName ).prop( "checked", "checked" );
        }
      }

    } );

    var saveCooldown = null;
    ui.events.on( "files.change", function() {
      if( saveCooldown !== null ) {
        window.clearTimeout( saveCooldown );
      }
      saveCooldown = window.setTimeout( function() {
        var files = ui.getFiles();
        app.save( "commandstudio-project", files );
        saveCooldown = null;
      }, 1000 );
    } );

  };

  App.prototype.save = function( key, data ) {
    window.localStorage.setItem( key, JSON.stringify( data ) );
  };

  App.prototype.load = function( key ) {
    var data = window.localStorage.getItem( key );
    if( data !== null ) {
      return JSON.parse( data );
    }
    return null;
  };

  App.prototype.loadOptions = function() {
    var userOptions = this.load( "options" );
    if( userOptions === null ) return;

    for( var optionName in this.options ) {
      if( typeof userOptions[ optionName ] !== "undefined" ) {
        this.options[ optionName ] = userOptions[ optionName ];
      }
    }
  };

  App.prototype.saveOptions = function() {
    this.save( "options", this.options );
  };

  return App;

} );
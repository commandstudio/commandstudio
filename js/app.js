define( [ "ui", "compiler" ], function( UI, Compiler ) {

  function App() {
    this.ui = new UI();
    this.compiler = new Compiler();

    var projectSave = localStorage.getItem( "commandstudio-project" );
    if( projectSave !== null ) {
      this.ui.setFiles( JSON.parse( projectSave ) );
    } else {
      this.ui.newFile( "new_file" );
    }

    this.initEvents();
  }

  App.prototype = {

    initEvents : function() {
      var ui = this.ui,
        compiler = this.compiler;

      ui.events.on( "toolbar.compile-file", function() {
        compiler.setFiles( ui.getFiles() );
        try {
          var command = compiler.compile( ui.selectedFile );
          ui.setOutput( command );
          ui.selectOutput();
          console.log( "command length", command.length );
        } catch( exception ) {
          ui.setOutput( exception );
        }
      } );

      ui.events.on( "toolbar.project-export", function() {
        var project = {
            version : "0.1",
            files : ui.getFiles()
          },
          link = "data:application/json," + encodeURI( JSON.stringify( project ) );

        ui.popin.show( "download", {
          "title" : "Export project",
          "text" : "Download your project",
          "link:href" : link,
          "link:download" : "project.json"
        } );
      } );

      ui.events.on( "toolbar.project-new", function() {
        ui.popin.confirm( {
          "title" : "Warning",
          "text" : "Creating a new project will erase any unsaved change. Are you sure you want to do this?",
          "action:confirm" : function() {
            ui.resetFiles();
          }
        } );
      } );

      ui.events.on( "toolbar.project-import", function() {
        ui.popin.confirm( {
          "title" : "Warning",
          "text" : "Importing a new project will erase any unsaved change. Are you sure you want to do this?",
          "action:confirm" : function() {
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
                  "title" : "Error",
                  "text" : "Invalid file format"
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

      var saveCooldown = null;
      ui.events.on( "files.change", function() {
        if( saveCooldown !== null ) {
          window.clearTimeout( saveCooldown );
        }
        saveCooldown = window.setTimeout( function() {
          var files = ui.getFiles();
          localStorage.setItem( "commandstudio-project", JSON.stringify( files ) );
          saveCooldown = null;
        }, 1000 );
      } );

    }

  };

  return App;

} );
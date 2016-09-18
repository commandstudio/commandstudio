define( [
  "jquery",
  "codemirror",
  "ui/popin",
  "utils/eventmanager"
], function(
  $,
  CodeMirror,
  Popin,
  EventManager
) {
  function UI() {
    this.$toolbar = $( ".ui-toolbar" );
    this.$fileList = $( ".ui-filelist" );
    this.$fileInput = $( ".ui-fileInput" );
    this.$editor = $( ".ui-editor" );
    this.$output = $( ".ui-output" );
    this.editor = CodeMirror( this.$editor[0], {
      lineWrapping: false,
      lineNumbers: true,
      tabSize: 2,
      mode: "commander",
      theme: "lesser-dark",
      extraKeys: {
        "Tab": function( cm ) {
          if ( cm.somethingSelected() ) {
            cm.execCommand( "indentMore" );
          }
          else {
            cm.execCommand( "insertSoftTab" );
          }
        },
        "Shift-Tab": "indentLess",
        "Ctrl-Space": "autocomplete"
      }
    } );

    this.editorMode = "commander";
    this.documents = {};
    this.selectedFile = null;
    this.events = new EventManager();

    this.popin = new Popin();

    this.initEvents();
  }

  UI.prototype = {

    initEvents: function() {
      var ui = this,
        $window = $( window );

      $window.on( "keydown", function( e ) {
        if( e.ctrlKey ) {
          if( e.key === "s" ) {
            ui.events.fire( "toolbar.project-export" );
            e.preventDefault();
          }
        }
      } );

      this.events.on( "toolbar.file-new", function() {
        ui.popin.prompt( {
          "title": "New file",
          "label": "New file name :",
          "input:placeholder": "new_file",
          "notice": "File name must contain only letters, numbers, hyphens, and underscores.",
          "action:confirm": function( fileName ) {
            try {
              ui.newFile( fileName );
            } catch( error ) {
              ui.popin.show( "alert", {
                title: "Error",
                text: error
              } );
            }
          }
        } );
      } );

      this.events.on( "toolbar.file-rename", function() {
        ui.popin.prompt( {
          "title": "Rename file",
          "label": "New name for \"" + ui.selectedFile + "\" :",
          "input:placeholder": "new_file",
          "notice": "File name must contain only letters, numbers, hyphens, and underscores.",
          "action:confirm": function( fileName ) {
            try {
              ui.renameFile( ui.selectedFile, fileName );
            } catch( error ) {
              ui.popin.show( "alert", {
                "title": "Error",
                "text": error
              } );
            }
          }
        } );
      } );

      this.events.on( "toolbar.file-delete", function() {
        ui.popin.confirm( {
          "title": "Delete file",
          "text": "Do you really want to delete \"" + ui.selectedFile + "\"?",
          "action:confirm": function() {
            ui.deleteFile( ui.selectedFile, true );
          }
        } );
      } );

      this.events.on( "toolbar.editor-undo", function() {
        ui.editor.undo();
        ui.editor.focus();
      } );

      this.events.on( "toolbar.editor-redo", function() {
        ui.editor.redo();
        ui.editor.focus();
      } );

      this.$toolbar.on( "click", ".ui-action", function( e ) {
        var command = $( this ).data( "command" );
        ui.events.fire( "toolbar." + command );
        e.preventDefault();
      } );

      this.$fileList.on( "click", ".ui-file", function() {
        var fileName = $( this ).html();
        ui.selectFile( fileName );
      } );

      this.editor.on( "change", function() {
      // ui.events.fire( 'editor.change' );
        ui.events.fire( "files.change" );
      } );
    },

    newFile: function( fileName ) {
      this.addFile( fileName, "" );
      this.selectFile( fileName );

      this.events.fire( "files.change" );
    },

    addFile: function( fileName, fileContent ) {
      if( typeof this.documents[ fileName ] !== "undefined" ) {
        throw "The file " + fileName + " already exists";
      }
      if( ! fileName.match( /^[a-z0-9_-]+$/i ) ) {
        throw "The name " + fileName + " is not valid (a-z0-9_-)";
      }

      this.$fileList.append( "<div class=\"ui-file\" id=\"file-" + fileName + "\">" + fileName + "</div>" );

      var document = CodeMirror.Doc( fileContent, this.editorMode );
      this.editor.swapDoc( document );
      this.documents[ fileName ] = document;

      this.events.fire( "files.change" );
    },

    renameFile: function( oldFileName, newFileName ) {
      if( typeof this.documents[ newFileName ] !== "undefined" ) {
        throw "The file " + newFileName + " already exists";
      }
      if( ! newFileName.match( /^[a-z0-9_-]+$/i ) ) {
        throw "The name " + newFileName + " is not valid (a-z0-9_-)";
      }

      this.$fileList.find( "#file-" + oldFileName )
      .attr( "id", "file-" + newFileName )
      .html( newFileName );

      var document = this.documents[ oldFileName ];
      delete this.documents[ oldFileName ];
      this.documents[ newFileName ] = document;
      if( this.selectedFile === oldFileName ) this.selectedFile = newFileName;

      this.events.fire( "files.change" );
    },

    deleteFile: function( fileName, createNewFile ) {
      if( typeof this.documents[ fileName ] === "undefined" ) {
        throw "The file " + fileName + " does not exist";
      }

      this.$fileList.find( "#file-" + fileName ).detach();
      delete this.documents[ fileName ];

      if( this.selectedFile === fileName ) {
        var otherFile = null;
        for( otherFile in this.documents ) break;
        if( otherFile === null ) {
          this.selectedFile = null;
          if( createNewFile ) this.newFile( "new_file" );
        } else {
          this.selectFile( otherFile );
        }
      }

      this.events.fire( "files.change" );
    },

    selectFile: function( fileName ) {
      if( fileName !== this.selectedFile ) {
        this.$fileList.find( ".active" ).removeClass( "active" );
        this.$fileList.find( "#file-" + fileName ).addClass( "active" );
        this.editor.swapDoc( this.documents[fileName] );
        this.selectedFile = fileName;
      }
      this.editor.focus();
    },

    getFiles: function() {
      var files = {};
      for( var i in this.documents ) {
        files[ i ] = this.documents[i].getValue();
      }
      return files;
    },

    setFiles: function( files ) {
      var fileName;
      for( fileName in this.documents ) {
        this.deleteFile( fileName );
      }
      var firstFile = null;
      for( fileName in files ) {
        if( firstFile === null ) firstFile = fileName;
        this.addFile( fileName, files[fileName] );
      }
      this.selectFile( firstFile );
    },

    resetFiles: function() {
      for( var fileName in this.documents ) {
        this.deleteFile( fileName, true );
      }
    },

    setOutput: function( output ) {
      this.$output.val( output );
    },

    selectOutput: function() {
      this.$output[0].focus();
      this.$output[0].select();
    },

    promptFile: function( callback ) {
      var ui = this;
      try {
        this.$fileInput.get( 0 ).value = null;
      }
      catch( e ) {
        ui.popin.show( "alert", {
          "title": "Error",
          "text": e
        } );
      }
      // TODO: prevent callback stacking if "cancel" is chosen
      this.$fileInput.one( "change", callback );
      this.$fileInput.click();
    }
  };

  return UI;

} );

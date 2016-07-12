function UI() {
  this.$toolbar = $('.ui-toolbar');
  this.$fileList = $('.ui-filelist');
  this.$fileInput = $('.ui-fileInput');
  this.$editor = $('.ui-editor');
  this.$output = $('.ui-output');
  this.editor = CodeMirror(this.$editor[0], {
    lineWrapping: false,
    lineNumbers: true,
    mode: "commander",
    theme: 'lesser-dark',
    extraKeys : {
      Tab: function(cm) {
        var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
        cm.replaceSelection(spaces);
      }
    }
  });

  this.editorMode = 'commander';
  this.documents = {};
  this.selectedFile = null;
  this.events = new EventManager();

  this.popin = new Popin();

  this.initEvents();
}

UI.prototype = {

  initEvents : function() {
    var ui = this;

    this.events.on( 'toolbar.file-new', function() {
      ui.popin.prompt({
        'title' : 'New file',
        'label' : 'New file name :',
        'input:placeholder' : 'new_file',
        'notice' : 'File name must contain only letters, numbers and underscores.',
        'action:confirm' : function( fileName ) {
          try {
            ui.newFile( fileName );
          } catch( error ) {
            ui.popin.show( 'alert', {
              title : 'Error',
              text : error,
            });
          }
        }
      });
    });

    this.events.on( 'toolbar.file-rename', function() {
      ui.popin.prompt({
        'title' : 'Rename file',
        'label' : 'New name for "' + ui.selectedFile + '" :',
        'input:placeholder' : 'new_file',
        'notice' : 'File name must contain only letters, numbers and underscores.',
        'action:confirm' : function( fileName ) {
          try {
            ui.renameFile( ui.selectedFile, fileName );
          } catch( error ) {
            ui.popin.show( 'alert', {
              'title' : 'Error',
              'text' : error,
            });
          }
        }
      });
    });

    this.events.on( 'toolbar.file-delete', function() {
      ui.popin.confirm({
        'title' : 'Delete file',
        'text' : 'Do you really want to delete "' + ui.selectedFile + '"?',
        'action:confirm' : function() {
          ui.deleteFile( ui.selectedFile, true );
        }
      });
    });

    this.events.on( 'toolbar.editor-undo', function() {
      ui.editor.undo();
      ui.editor.focus();
    });

    this.events.on( 'toolbar.editor-redo', function() {
      ui.editor.redo();
      ui.editor.focus();
    });

    this.$toolbar.on( 'click', '.ui-action', function(e) {
      var command = $(this).data('command');
      ui.events.fire( 'toolbar.' + command );
      e.preventDefault();
    });

    this.$fileList.on( 'click', '.ui-file', function() {
      var fileName = $(this).html();
      ui.selectFile( fileName );
    });

    this.editor.on( 'change', function() {
      // ui.events.fire( 'editor.change' );
      ui.events.fire( 'files.change' );
    });
  },

  newFile : function( fileName ) {
    this.addFile( fileName, '' );
    this.selectFile( fileName );

    this.events.fire( 'files.change' );
  },

  addFile : function( fileName, fileContent ) {
    if( typeof this.documents[ fileName ] !== 'undefined' ) {
      throw "The file " + fileName + " already exists";
    }
    if( ! fileName.match( /^[a-z0-9_-]+$/i ) ) {
      throw "The name " + fileName + " is not valid (a-z0-9_-)";
    }

    this.$fileList.append( '<div class="ui-file" id="file-' + fileName + '">' + fileName + '</div>' );

    var document = CodeMirror.Doc( fileContent, this.editorMode );
    this.editor.swapDoc( document );
    this.documents[ fileName ] = document;

    this.events.fire( 'files.change' );
  },

  renameFile : function( oldFileName, newFileName ) {
    if( typeof this.documents[ newFileName ] !== 'undefined' ) {
      throw "The file " + newFileName + " already exists";
    }
    if( ! newFileName.match( /^[a-z0-9_-]+$/i ) ) {
      throw "The name " + newFileName + " is not valid (a-z0-9_-)";
    }

    this.$fileList.find( '#file-' + oldFileName )
      .attr( 'id', 'file-' + newFileName )
      .html( newFileName );

    var document = this.documents[ oldFileName ];
    delete this.documents[ oldFileName ];
    this.documents[ newFileName ] = document;
    if( this.selectedFile === oldFileName ) this.selectedFile = newFileName;

    this.events.fire( 'files.change' );
  },

  deleteFile : function( fileName, createNewFile ) {
    if( typeof this.documents[ fileName ] === 'undefined' ) {
      throw "The file " + fileName + " does not exist";
    }

    this.$fileList.find( '#file-' + fileName ).detach();
    delete this.documents[ fileName ];

    if( this.selectedFile === fileName ) {
      var otherFile = null;
      for( otherFile in this.documents ) break;
      if( otherFile === null ) {
        this.selectedFile = null;
        if( createNewFile ) this.newFile( 'new_file' );
      } else {
        this.selectFile( otherFile );
      }
    }

    this.events.fire( 'files.change' );
  },

  selectFile : function( fileName ) {
    if( fileName !== this.selectedFile ) {
      this.$fileList.find( '.active' ).removeClass( 'active' );
      this.$fileList.find( '#file-' + fileName ).addClass( 'active' );
      this.editor.swapDoc( this.documents[fileName] );
      this.selectedFile = fileName;
    }
    this.editor.focus();
  },

  getFiles : function() {
    var files = {};
    for( var i in this.documents ) {
      files[ i ] = this.documents[i].getValue();
    }
    return files;
  },

  setFiles : function( files ) {
    for( var fileName in this.documents ) {
      this.deleteFile( fileName );
    }
    var firstFile = null;
    for( var fileName in files ) {
      if( firstFile === null ) firstFile = fileName;
      this.addFile( fileName, files[fileName] );
    }
    this.selectFile( firstFile );
  },

  resetFiles : function() {
    for( var fileName in this.documents ) {
      this.deleteFile( fileName, true );
    }
  },

  setOutput : function( output ) {
    this.$output.val( output );
  },

  selectOutput : function() {
    this.$output[0].focus();
    this.$output[0].select();
  },

  promptFile : function(callback) {
    try {
      this.$fileInput.get(0).value = null;
    }
    catch(e) {}
    // TODO: prevent callback stacking if "cancel" is chosen
    this.$fileInput.one( 'change', callback );
    this.$fileInput.click();
  },
};

function Popin() {
  this.$body = $( 'body' );
  this.$container = $( '.popin-container' );
  this.$popin = $( '.popin' );

  this.callbacks = {};

  this.initTemplates();
  this.initEvents();
}

Popin.prototype = {

  initTemplates : function() {
    var popin = this;
    this.templates = {};
    var popin = this;
    $( '.popin-template' ).each( function() {
      var $template = $(this),
          templateName = $template.data( 'template' );
      popin.templates[ templateName ] = $template.clone().addClass('popin').removeClass( 'popin-template' );
    });
  },

  initEvents : function() {
    var popin = this;

    this.$popin.on( 'click', '.on-click', function() {
      var action = $(this).data( 'action' );
      if( action === 'close' ) popin.hide();
      else {
        if( typeof popin.callbacks[action] === 'function' ) {
          popin.callbacks[action].apply( popin );
        }
      }
    });

    this.$popin.on( 'keydown', '.on-key', function(e) {
      if( e.key !== 'Enter' ) return;
      var action = $(this).data( 'action' );
      if( action === 'close' ) popin.hide();
      else {
        if( typeof popin.callbacks[action] === 'function' ) {
          popin.callbacks[action].apply( popin );
        }
      }
    });

  },

  show : function( templateName, options ) {
    var popin = this;
    window.setTimeout( function() {
      popin.$popin.find( '.popin-focus' ).eq(0).focus();
    }, 50);

    if( typeof templateName !== 'undefined' ) {
      this.loadTemplate( templateName, options );
    }

    this.$container.addClass( 'popin-visible' );
  },

  hide : function( templateName ) {
    this.callbacks = {};
    this.$container.removeClass( 'popin-visible' );
  },

  loadTemplate : function( templateName, options ) {
    this.$popin.html( this.templates[templateName].html() );

    if( typeof options !== 'undefined' ) {
      for( var key in options ) {
        var value = options[key],
            match = key.match( /([\w-]+)(?::([\w-]+))?/ );
        if( typeof match[2] === 'undefined' ) {
          this.$popin.find( '.e-' + match[1] ).html( value );
        }
        else {
          if( match[1] !== 'action' ) {
            this.$popin.find( '.e-' + match[1] ).attr( match[2], value );
          }
        }
      }
    }
  },

  prompt : function( options ) {
    var popin = this;
    this.callbacks[ 'confirm' ] = function() {
      var result = this.$popin.find( '.e-input' ).val();
      popin.hide();
      if( options['action:confirm'] ) {
        options['action:confirm']( result );
      }
    };
    this.show( 'prompt', options );
  },

  confirm : function( options ) {
    var popin = this;
    this.callbacks[ 'confirm' ] = function() {
      popin.hide();
      if( options['action:confirm'] ) {
        options['action:confirm']();
      }
    };
    this.show( 'confirm', options );
  },

};
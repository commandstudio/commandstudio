define( [ "jquery" ], function( $ ) {
  function Popin() {
    this.$body = $( "body" );
    this.$container = $( ".popin-container" );
    this.$popin = $( ".popin" );

    this.callbacks = {};

    this.initTemplates();
    this.initEvents();
  }

  Popin.prototype = {

    initTemplates : function() {
      var popin = this;
      this.templates = {};
      $( ".popin-template" ).each( function() {
        var $template = $( this ),
          templateName = $template.data( "template" );
        popin.templates[ templateName ] = $template.clone().addClass( "popin" ).removeClass( "popin-template" );
      } );
    },

    initEvents : function() {
      var popin = this;

      this.$popin.on( "click", ".on-click", function() {
        var action = $( this ).data( "action" );
        if( action === "close" ) popin.hide();
        else {
          if( typeof popin.callbacks[action] === "function" ) {
            popin.callbacks[action].apply( popin );
          }
        }
      } );

      this.$popin.on( "keydown", ".on-key", function( e ) {
        if( e.key !== "Enter" ) return;
        var action = $( this ).data( "action" );
        if( action === "close" ) popin.hide();
        else {
          if( typeof popin.callbacks[action] === "function" ) {
            popin.callbacks[action].apply( popin );
          }
        }
      } );

    },

    show : function( templateName, options ) {
      var popin = this;
      window.setTimeout( function() {
        popin.$popin.find( ".popin-focus" ).eq( 0 ).focus();
      }, 50 );

      if( typeof templateName !== "undefined" ) {
        this.loadTemplate( templateName, options );
      }

      this.$container.addClass( "popin-visible" );
    },

    hide : function() {
      this.callbacks = {};
      this.$container.removeClass( "popin-visible" );
    },

    loadTemplate : function( templateName, options ) {
      this.$popin.html( this.templates[templateName].html() );

      if( typeof options !== "undefined" ) {
        for( var key in options ) {
          var value = options[key],
            match = key.match( /([\w-]+)(?::([\w-]+))?/ );
          if( typeof match[2] === "undefined" ) {
            this.$popin.find( ".e-" + match[1] ).html( value );
          }
          else {
            if( match[1] !== "action" ) {
              this.$popin.find( ".e-" + match[1] ).attr( match[2], value );
            }
          }
        }
      }
    },

    prompt : function( options ) {
      var popin = this;
      this.callbacks[ "confirm" ] = function() {
        var result = this.$popin.find( ".e-input" ).val();
        popin.hide();
        if( options["action:confirm"] ) {
          options["action:confirm"]( result );
        }
      };
      this.show( "prompt", options );
    },

    confirm : function( options ) {
      var popin = this;
      this.callbacks[ "confirm" ] = function() {
        popin.hide();
        if( options["action:confirm"] ) {
          options["action:confirm"]();
        }
      };
      this.show( "confirm", options );
    },

  };


  return Popin;
} );
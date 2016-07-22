define( function() {
  function EventManager() {
    this.callbacks = {};
  }

  EventManager.prototype = {

    on : function( eventName, callback ) {
      if( typeof this.callbacks[ eventName ] === "undefined" ) {
        this.callbacks[ eventName ] = [];
      }
      this.callbacks[ eventName ].push( callback );
    },

    fire : function( eventName, data ) {
      if( typeof this.callbacks[ eventName ] === "undefined" ) return;
      var i = this.callbacks[ eventName ].length;
      while( i-- ) {
        this.callbacks[ eventName ][ i ]( data );
      }
    },

    reset : function( eventName ) {
      this.callbacks[ eventName ] = [];
    },

  };

  return EventManager;
} );
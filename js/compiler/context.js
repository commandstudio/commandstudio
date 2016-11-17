define( function() {

  function Context( parent ) {
    this.parent = ( parent != null ) ? parent : null;
    this.data = {};
  }

  Context.prototype.push = function() {
    return new Context( this );
  };

  Context.prototype.set = function( key, value ) {
    this.data[ key ] = value;
  };

  Context.prototype.get = function( key ) {
    if( typeof this.data[ key ] !== "undefined" ) return this.data[ key ];
    else if( this.parent !== null ) return this.parent.get( key );
  };

  return Context;

} );
define( function() {

  function Output() {
    this.values = [];
    this.currentValue = "";
  }

  Output.prototype.push = function( str ) {
    this.values.push( str );
    this.next();
  };

  Output.prototype.feed = function( str ) {
    this.currentValue += str;
  };

  Output.prototype.flush = function() {
    if( this.currentValue !== "" ) {
      this.values.push( this.currentValue );
      this.next();
    }
  };

  Output.prototype.next = function() {
    this.currentValue = "";
  };

  return Output;

} );
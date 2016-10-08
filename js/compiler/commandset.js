define( function() {

  function CommandSet() {
    this.commands = [];
    this.currentCommand = "";
  }

  CommandSet.prototype.feed = function( str ) {
    this.currentCommand += str;
  };

  CommandSet.prototype.flush = function() {
    if( this.currentCommand !== "" ) {
      this.next();
    }
  };

  CommandSet.prototype.next = function() {
    this.commands.push( this.currentCommand );
    this.currentCommand = "";
  };

  return CommandSet;

} );
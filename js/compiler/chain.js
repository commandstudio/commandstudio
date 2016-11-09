define( [
  "compiler/commandblock",
  "commandtools"
], function(
  CommandBlock,
  CT
) {

  function Chain( position ) {
    this.commandBlocks = [];
    this.index = 0;

    this.x = position.x;
    this.y = position.y;
    this.z = position.z;

    if( this.y[0] === "~" ) {
      this.y = CT.op( "-", this.y, "3" );
    }

    this.resetBlock();
  }

  Chain.prototype.resetBlock = function() {
    this.currentBlock = new CommandBlock();
    this.currentBlock.x = this.x;
    this.currentBlock.y = CT.op( "+", this.y, this.index );
    this.currentBlock.z = this.z;
  };

  Chain.prototype.feed = function( str ) {
    this.currentBlock.command += str;
  };

  Chain.prototype.flush = function() {
    if( this.currentBlock.command !== "" ) {
      this.push( this.currentBlock );
    }
  };

  Chain.prototype.push = function( commandBlock ) {
    this.commandBlocks.push( commandBlock );
    this.next();
  };

  Chain.prototype.next = function() {
    this.index++;
    this.resetBlock();
  };

  return Chain;

} );
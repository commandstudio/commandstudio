define( [
  "compiler/commandblock",
  "commandtools"
], function(
  CommandBlock,
  CT
) {

  function Chain( position, direction ) {
    this.commandBlocks = [];
    this.index = 0;

    this.position = position;
    this.direction = direction;

    if( this.position[1][0] === "~" ) {
      this.position[1] = CT.numOp( "-", this.position[1], "3" );
    }

    this.resetBlock();
  }

  Chain.prototype.currentRelative = function() {
    return CT.numsOp( "*", [ this.index, this.index, this.index ], CT.relativeDirections[ this.direction ] );
  };

  Chain.prototype.currentPosition = function() {
    return CT.numsOp( "+", this.position, this.currentRelative() );
  };

  Chain.prototype.resetBlock = function() {
    this.currentBlock = new CommandBlock();
    this.currentBlock.position = this.currentPosition();
    this.currentBlock.direction = this.direction;
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
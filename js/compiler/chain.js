define( [
  "commandtools"
], function(
  CT
) {

  function Chain( position ) {
    this.x = position.x;
    this.y = position.y;
    this.z = position.z;
    this.commandBlocks = [];
    this.index = 0;

    if( this.y[0] === "~" ) {
      this.y = CT.op( "-", this.y, "3" );
    }
  }

  Chain.prototype.push = function( command ) {
    var commandBlock = { command: command };
    commandBlock.x = this.x;
    commandBlock.y = CT.op( "+", this.y, this.index );
    commandBlock.z = this.z;
    commandBlock.type = "command_block";
    commandBlock.dataValue = 0;
    this.commandBlocks.push( commandBlock );
    this.index++;
  };

  return Chain;

} );
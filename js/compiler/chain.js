define( function() {

  function Chain( mode ) {
    this.mode = mode;
    this.commandBlocks = [];
    this.currentCommandBlock = null;
  }

  Chain.prototype.newCommandBlock = function() {
    this.currentCommandBlock = { command: "" };
    this.commandBlocks.push( this.currentCommandBlock );
  };

  Chain.prototype.pushWord = function( word ) {
    if( this.currentCommandBlock === null ) {
      this.newCommandBlock();
    }
    this.currentCommandBlock.command += word;
  };

  Chain.prototype.next = function() {
    this.currentCommandBlock = null;
  };

  return Chain;

} );
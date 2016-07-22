define( function() {
  function BlockPile( position ) {
    this.position = typeof position === "undefined" ? null : position;
    this.blocks = [];
  }

  BlockPile.prototype = {

    pushCommandBlock : function( attr, command ) {
      var type, auto, condition;

      if( attr.match( /i/ ) ) type = "command_block";
      if( attr.match( /c/ ) ) type = "chain_command_block";
      if( attr.match( /r/ ) ) type = "repeating_command_block";
      if( attr.match( /0/ ) ) auto = false;
      if( attr.match( /1/ ) ) auto = true;
      if( attr.match( /\?/ ) ) condition = true;
      if( attr.match( /!/ ) ) condition = false;

      var block = { Block:type, Data:1, TileEntityData:{ Command:command } };
      if( auto === true ) block.TileEntityData.auto = 1;
      if( condition === true ) block.Data += 8;

      this.blocks.push( block );
    }

  };

  return BlockPile;
} );
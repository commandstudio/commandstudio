define( [
  "compiler/scope",
  "compiler/parser",
  "compiler/chain",
  "commandtools"
], function(
  Scope,
  Parser,
  Chain,
  CT
) {

  function Compiler() {
    this.files = {};
  }

  Compiler.prototype.setFiles = function( files ) {
    this.files = files;
  };

  Compiler.prototype.compile = function( fileName ) {
    var code = this.files[ fileName ],
      scope = new Scope(),
      output = "";

    var parser = new Parser( code );
      // scope.addInclude( fileName );
      // this.prepareScope( code, scope );
      // scope.resetIncludes();
      // scope.addInclude( fileName );
    var state = { mainChain: new Chain( "main" ) };
    this.parseSection( parser, state );

    var compiledCommand = this.compileMainChain( state.mainChain );
      // var blockPiles = this.generateBlocks( output );

      // console.log( "blockPiles", blockPiles );
      // if( blockPiles.every( function( pile ){ return pile.blocks.length === 0; } ) ) {
      //   throw "Compilation resulted in no command blocks.";
      // }

      // var command = CT.summonPiles( blockPiles );
      // if( command.length > 32500 ) {
      //   throw "Summon command is too long! (" + command.length + " characters)";
      // }

    return compiledCommand;
  };

  Compiler.prototype.parseSection = function( parser, state ) {
    var token;
    while( ! parser.eos() ) {

      token = parser.currentToken;
      if( parser.eol() ) {
        state.mainChain.next();
      }
      else {
        state.mainChain.pushWord( token.value );
      }

      parser.next();
    }

    console.log( state.mainChain );
  };

  Compiler.prototype.compileMainChain = function( mainChain ) {
    var commands = [],
      minecarts = [],

      i, l;

    for( i = 0, l = mainChain.commandBlocks.length ; i < l ; i++ ) {
      commands.push( mainChain.commandBlocks[i].command );
    }
    commands.push( "setblock ~ ~-1 ~ command_block 0 replace {auto:1,Command:kill @e[type=MinecartCommandBlock,r=1]}" );

    for( i = 0, l = commands.length ; i < l ; i++ ) {
      minecarts.push( { id: "MinecartCommandBlock", Command: commands[i] } );
    }

    var root = {
      Block: "chain_command_block",
      TileEntityData: { Command: "fill ~ ~ ~ ~ ~2 ~ air" },
      Time: 1,
      Passengers: [ {
        id: "FallingSand",
        Block: "redstone_block",
        Time: 1,
        Passengers: [ {
          id: "FallingSand",
          Block: "activator_rail",
          Time: 1,
          Passengers: minecarts
        } ]
      } ]
    };

    var summonCommand = "summon FallingSand ~ ~.6 ~ " + CT.serialize( root );

    return summonCommand;
  };

  return Compiler;

} );
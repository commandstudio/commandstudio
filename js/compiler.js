define( [
  "compiler/scope",
  "compiler/parser",
  "compiler/def",
  "compiler/blockpile",
  "commandtools"
], function(
  Scope,
  Parser
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
    output = this.parseSection( parser );
      // var blockPiles = this.generateBlocks( output );

      // console.log( "blockPiles", blockPiles );
      // if( blockPiles.every( function( pile ){ return pile.blocks.length === 0; } ) ) {
      //   throw "Compilation resulted in no command blocks.";
      // }

      // var command = CT.summonPiles( blockPiles );
      // if( command.length > 32500 ) {
      //   throw "Summon command is too long! (" + command.length + " characters)";
      // }

    return output;
  };

  Compiler.prototype.parseSection = function( parser ) {
    while( ! parser.eos() ) {
      console.log( parser.next() );
    }
  };

  return Compiler;

} );
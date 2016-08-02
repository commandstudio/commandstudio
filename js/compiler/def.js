define( [ "utils/scanner" ], function( Scanner ) {

  function Def( args, code ) {
    if( typeof args === "string" ) this.args = this.parseArgs( args );
    else this.args = args;
    this.code = code;
  }

  Def.prototype = {

    parseArgs: function( rawArgs ) {
      var args = [];

      var scanner = new Scanner( rawArgs );
      while( !scanner.eos() ) {
        var arg = scanner.scanUntil( /,/ ),
          match = arg.match( /^\s*\$(\w+)\s*(?:=\s*(.+))?$/ );

        if( match === null ) throw "Incorrect argument declaration " + arg;

        var argName = match[1],
          argDefault = match[2];

        if( typeof argDefault === "undefined" ) argDefault = null;
        else argDefault = argDefault.trim();
        args.push( { name: argName, defaultValue: argDefault } );

        scanner.scan( /,/ );
      }
      return args;
    },

    execute: function( compiler, scope, rawArgs ) {
      var def = this;

      this.args.forEach( function( defArg ) {
        scope.setVar( defArg.name, defArg.defaultValue );
      } );

      if( !rawArgs.match( /^\s*$/ ) ) {
        var defArgs = rawArgs.split( "," );
        defArgs.forEach( function( argValue, i ) {
          argValue = argValue.trim();
          if( typeof def.args[i] === "undefined" ) throw "Too many arguments passed to def : (" + rawArgs + ")";
          scope.setVar( def.args[i].name, argValue );
        } );
      }

      return compiler.parseSection( this.code, scope );
    }

  };

  return Def;

} );
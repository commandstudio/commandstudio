var Compiler = (function() {
  
  var expressionRes = {
    'openingDef' : /\^\w+\s*\(/,
    'closingDef' : /\)/,
    'openingOperation' : /\{#/,
    'closingOperation' : /#\}/,
    'variable' : /\$\w+/
  };
  
  function extractRe( re ) {
    var match = re.toString().match( /^\/(.+)\/[a-z]*$/ );
    return match[1];
  }
  
  function combineRes() {
    var res = [],
        i = arguments.length,
        j, re;
    
    while( i-- ) {
      for( var j in arguments[i] ) {
        re = arguments[i][j];
        res.push( extractRe(re) );
      }
    }
    
    return new RegExp( '(?:' + res.join('|') + ')' );
  }
  
  var expressionRe = combineRes( expressionRes );
  
  function Compiler() {
    this.files = {};
  }

  Compiler.prototype = {
    
    setFiles : function( files ) {
      this.files = files;
    },
    
    compile : function( fileName ) {
      var code = this.files[ fileName ],
          scope = new Scope(),
          output = '',
          
          match, replace;
      
      scope.addInclude( fileName );
      this.prepareScope( code, scope );
      scope.resetIncludes();
      scope.addInclude( fileName );
      output = this.parseSection( code, scope );
      var blockPiles = this.generateBlocks( output );
      
      console.log( 'blockPiles', blockPiles );
      
      var command = CT.summonPiles( blockPiles );
      if( command.length > 32500 ) alert( "Warning: summon command is too long! (" + command.length + " characters)" );
      
      return command;
    },
    
    prepareScope : function( code, scope ) {
      code = this.cleanCode( code );
      
      var scanner = new Scanner( code ),
          line;
      
      // Includes
      
      while( !scanner.eos() ) {
        scanner.scanUntil( /^include(?:\s|$)/m );
        line = scanner.scan( /.*/ );
        
        if( line.match(/^include(?:\s|$)/) ) {
          match = line.match( /^include\s+(\w+)$/ );
          if( match === null ) throw 'Incorrect include on line : ' + line;
          
          var include = match[1];
          if( typeof this.files[ include ] === 'undefined' ) throw 'Missing file for include : ' + include;
          
          if( ! scope.hasInclude( include ) ) {
            scope.addInclude( include );
            this.prepareScope( this.files[ include ], scope );
          }
        }
      }
      
      // Defs
      
      scanner.reset();
      
      while( !scanner.eos() ) {
        scanner.scanUntil( /^def(?:\s|$)/m );
        line = scanner.scan( /.*/ );
        
        if( line.match(/^def(?:\s|$)/) ) {
          match = line.match( /^def\s+\^(\w+)\s*\(([^\)]*)\)$/ );
          if( match === null ) throw 'Incorrect def on line : ' + line;
          
          scanner.scan( /\n/ );
          var defName = match[1],
              defArgs = match[2],
              defCode = scanner.scanBlock(),
              def = new Def( defArgs, defCode );
          
          scope.setDef( defName, def );
          // console.log( 'def', def );
        }
      }
    },

    parseSection : function( code, scope ) {
      var compiler = this,
          output = '',
      
          match, replace;
      
      code = this.cleanCode( code );
      
      var scanner = new Scanner( code );
      while( !scanner.eos() ) {
        var block = scanner.scanBlock();
        scanner.scan( /\n/ );
        
        block = this.reduceBlock( block );
        
        // Includes
        if( block.match(/^include(?:\s|$)/) ) {
          match = block.match( /^include\s+(\w+)$/ );
          if( match === null ) throw 'Incorrect include on line : ' + block;
          
          var include = match[1];
          if( typeof this.files[ include ] === 'undefined' ) throw 'Missing file for include : ' + include;
          
          if( !scope.hasInclude(include) ) {
            scope.addInclude( include );
            this.parseSection( this.files[ include ], scope );
          }
          continue;
        }
        
        // Declarations
        
        // Def
        if( block.match( /^def(?:\s|$)/ ) ) continue;
        
        // Variable
        if( match = block.match( /^\$(\w+)\s*=\s*(.+)/ ) ) {
          scope.setVar( match[1], this.parseExpressions( new Scanner(match[2]), scope ) );
          continue;
        }
        
        block = this.parseExpressions( new Scanner(block), scope );
        
        // Compiler instructions
        if( block.match(/^position(?:\s|$)/) ) {
          match = block.match( /^position\s+(?:~?-?\d+|~)\s+(?:~?-?\d+|~)\s+(?:~?-?\d+|~)$/ );
          if( match === null ) throw 'Incorrect position on line : ' + block;
        }
        
        if( block.match(/^default(?:\s|$)/) ) {
          match = block.match( /^default\s+([irc\?!01]+)$/ );
          if( match === null ) throw 'Incorrect default on line : ' + block;
        }
        
        if( output === '' ) output = block;
        else output += "\n" + block;
        
        // console.log('block', block);
      }
      
      output = this.unescapeCharacters( output );
      
      console.log('output', output);
      return output;
    },
    
    unescapeCharacters : function( str ) {
      return str.replace( /\\(.?)/g, '$1' );
    },
    
    cleanCode : function( code ) {
      return code.replace( /[\t ]*(?:\/\/.*)?$/mg, '' );
    },
    
    parseExpressions : function( scanner, scope, context ) {
      if( typeof context === 'undefined' ) context = null;
      
      var output = '', escape, tag;
      
      while( !scanner.eos() ) {
        output += scanner.scanUntil( expressionRe );
        
        tag = scanner.scan( expressionRe );
        
        if( escape = output.match( /(\\)+$/ ) ) {
          if( escape[0].length % 2 === 1 ) {
            output += tag;
            continue;
          }
        }
        
        // Variable
        if( tag.match(expressionRes.variable) ) {
          var varName = tag.match( /\w+/ )[0];
          output += scope.getVar( varName );
        }
        
        // Def
        if( tag.match(expressionRes.openingDef) ) {
          var defName = tag.match( /\w+/ )[0],
              defArgs = this.parseExpressions( scanner, scope, 'def' );
          output += this.executeDef( scope, defName, defArgs );
        }
        else if( tag.match(expressionRes.closingDef) ) {
          if( context !== 'def' ) throw 'Unexpected def ending ")"';
          context = null;
          break;
        }
        
        // Operations
        else if( tag.match(expressionRes.openingOperation) ) {
          var operation = this.parseExpressions( scanner, scope, 'operation' );
          output += this.calculateOperation( operation );
        }
        else if( tag.match(expressionRes.closingOperation) ) {
          if( context !== 'operation' ) throw 'Unexpected operation ending "}}"';
          context = null;
          break;
        }
        
      }
      
      if( context !== null ) throw 'Unbalanced ' + context;
      return output;
    },
    
    executeDef : function( scope, defName, defArgs ) {
      var def = scope.getDef( defName );
      if( def === null ) throw "Call to undefined def : " + defName;
      var defScope = new Scope( scope );
      return def.execute( this, defScope, defArgs );
    },
    
    calculateOperation : function( operation ) {
      operation = operation.trim();
      
      while( operation.match(/(?:~?-?\d+|~)\s+(?:~?-?\d+|~)\s+(?:~?-?\d+|~)\s*\+\s*(?:~?-?\d+|~)\s+(?:~?-?\d+|~)\s+(?:~?-?\d+|~)/) ) {
        operation = operation.replace( /((?:~?-?\d+|~)\s+(?:~?-?\d+|~)\s+(?:~?-?\d+|~))\s*\+\s*((?:~?-?\d+|~)\s+(?:~?-?\d+|~)\s+(?:~?-?\d+|~))/,
          function( match, c1, c2 ) {
            return CT.addCoordinates( c1, c2 );
          }
        );
      }
      
      return operation;
    },
    
    reduceBlock : function( block ) {
      var reducedBlock = '',
          lines = block.split( /$/m );
      
      lines = lines.map(function(line, i) {
        line = line.trim();
        if( line !== '' && i > 0 ) {
          if( line[0] === '+' ) line = line.slice(1);
          else line = ' ' + line;
        }
        return line;
      });
      
      return lines.join('');
    },
    
    generateBlocks : function( code ) {
      var compiler = this,
          currentPile = new BlockPile(),
          blockPiles = [ currentPile ],
          scanner = new Scanner( code ),
          defaultAttr = 'c1!', blockAttr;
      
      while( !scanner.eos() ) {
        var line = scanner.scanUntil( /\n/ );
        scanner.scan( /\n/ );
        
        // Position
        if( match = line.match( /^position\s+((?:~?-?\d+|~))\s+((?:~?-?\d+|~))\s+((?:~?-?\d+|~))$/ ) ) {
          currentPile = new BlockPile( match.slice(1).join(' ') );
          blockPiles.push( currentPile );
          continue;
        }
        
        // Default
        if( match = line.match( /^default\s+([irc\?!01]+)$/ ) ) {
          defaultAttr = this.reduceAttr( defaultAttr + match[1] );
          continue;
        }
        
        // BlockAttr
        blockAttr = defaultAttr;
        line = line.replace( /^([irc01\?!]+):/, function( match, attr ) {
          blockAttr = compiler.reduceAttr( blockAttr + attr );
          return '';
        });
        
        currentPile.pushCommandBlock( blockAttr, line );
      }
      return blockPiles;
    },
    
    reduceAttr : function( attr ) {
      var type = '',
          active = '',
          conditional = '',
          
          i = attr.length, c;
      
      while( i-- ) {
        c = attr[i];
        if( c.match( /[irc]/ ) && type === '' ) type = c;
        else if( c.match( /[\?!]/ ) && conditional === '' ) conditional = c;
        else if( c.match( /[01]/ ) && active === '' ) active = c;
      }
      
      return type + active + conditional;
    },
    
  };

  function BlockPile( position ) {
    this.position = typeof position === 'undefined' ? null : position;
    this.blocks = [];
  }

  BlockPile.prototype = {
    
    pushCommandBlock : function( attr, command ) {
      var type, auto, condition;
      
      if( attr.match(/i/) ) type = 'command_block';
      if( attr.match(/c/) ) type = 'chain_command_block';
      if( attr.match(/r/) ) type = 'repeating_command_block';
      if( attr.match(/0/) ) auto = false;
      if( attr.match(/1/) ) auto = true;
      if( attr.match(/\?/) ) condition = true;
      if( attr.match(/!/) ) condition = false;
      
      var block = {Block:type,Data:'1b',TileEntityData:{Command:command}};
      if( auto === true ) block.TileEntityData.auto = '1b';
      if( condition === true ) block.TileEntityData.conditionMet = '1b';
      
      this.blocks.push( block );
    }
    
  };

  return Compiler;

})();

function Scope( parent ) {
  if( typeof parent === 'object' ) this.parent = parent;
  else this.parent = null;
  this.vars = {};
  this.defs = {};
  this.includes = {};
}

Scope.prototype = {
  
  setVar : function( varName, varValue ) {
    this.vars[ varName ] = varValue;
  },
  
  getVar : function( varName ) {
    if( typeof this.vars[ varName ] !== 'undefined' ) return this.vars[varName];
    else if( this.parent !== null ) return this.parent.getVar( varName );
    else throw "Undefined variable : " + varName;
  },
  
  hasVar : function( varName ) {
    return this.getVar( varName ) !== null;
  },
  
  setDef : function( defName, def ) {
    this.defs[ defName ] = def;
  },
  
  getDef : function( defName ) {
    if( typeof this.defs[ defName ] !== 'undefined' ) return this.defs[defName];
    else if( this.parent !== null ) return this.parent.getDef( defName );
    else return null;
  },
  
  addInclude : function( include ) {
    this.includes[ include ] = true;
  },
  
  hasInclude : function( include ) {
    if( typeof this.includes[ include ] !== 'undefined' ) return include;
    else if( this.parent !== null ) return this.parent.getInclude( include );
    else return false;
  },
  
  resetIncludes : function() {
    this.includes = {};
  },
  
};

function Def( args, code ) {
  if( typeof args === 'string' ) this.args = this.parseArgs( args );
  else this.args = args;
  this.code = code;
}

Def.prototype = {
  
  parseArgs : function( rawArgs ) {
    var args = [];
  
    var scanner = new Scanner( rawArgs );
    while( !scanner.eos() ) {
      var arg = scanner.scanUntil( /,/ ),
          match = arg.match( /^\s*\$(\w+)\s*(?:=\s*(.+))?$/ );
      
      if( match === null ) throw "Incorrect argument declaration " + arg;
      
      var argName = match[1],
          argDefault = match[2];
      
      if( typeof argDefault === 'undefined' ) argDefault = null;
      else argDefault = argDefault.trim();
      args.push( { name : argName, defaultValue : argDefault } );
      
      scanner.scan( /,/ );
    }
    return args;
  },
  
  execute : function( compiler, scope, rawArgs ) {
    var def = this;
    
    this.args.forEach( function(defArg, i) {
      scope.setVar( defArg.name, defArg.defaultValue );
    });
    
    if( !rawArgs.match( /^\s*$/ ) ) {
      var defArgs = rawArgs.split( ',' );
      defArgs.forEach( function(argValue, i) {
        argValue = argValue.trim();
        if( typeof def.args[i] === 'undefined' ) throw "Too many arguments passed to def : " + defName + "(" + rawArgs + ")";
        scope.setVar( def.args[i].name, argValue );
      });
    }
    
    return compiler.parseSection( this.code, scope );
  },
  
};
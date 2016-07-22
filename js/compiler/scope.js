define( function() {

  function Scope( parent ) {
    if( typeof parent === "object" ) this.parent = parent;
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
      if( typeof this.vars[ varName ] !== "undefined" ) return this.vars[varName];
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
      if( typeof this.defs[ defName ] !== "undefined" ) return this.defs[defName];
      else if( this.parent !== null ) return this.parent.getDef( defName );
    else return null;
    },

    addInclude : function( include ) {
      this.includes[ include ] = true;
    },

    hasInclude : function( include ) {
      if( typeof this.includes[ include ] !== "undefined" ) return include;
      else if( this.parent !== null ) return this.parent.getInclude( include );
    else return false;
    },

    resetIncludes : function() {
      this.includes = {};
    }

  };

  return Scope;

} );
var SchemeObject = require('./object'),
    SchemeCons = require('./cons'),
    SchemeSymbol = require('./symbol');

/**
 * Die Scheme User Defined Function
 * @param  {Object} _super Die Super-"Klasse"
 * @return {Object}        Scheme User-defined Funktion
 */
module.exports = (function (_super) {

    function SchemeUserDefinedFunction (args, bodyList, environment) {
        // Parent Constructor call
        _super.call(this);
        
        this.args = args;
        this.environment = environment;

        // bodyList soll mit der Begin-Funktion ausgewertet werden
        this.bodyList = new SchemeCons(new SchemeSymbol('begin'), bodyList);
    }

    // Erbe von SchemeObject
    SchemeUserDefinedFunction.prototype = Object.create(_super.prototype);
    SchemeUserDefinedFunction.prototype.constructor = SchemeUserDefinedFunction;
    SchemeUserDefinedFunction.prototype.isSchemeUserDefinedFunction = true;
    SchemeUserDefinedFunction.prototype.args = null;
    SchemeUserDefinedFunction.prototype.bodyList = null;
    SchemeUserDefinedFunction.prototype.environment = null;


    /** Ausgabe */
    SchemeUserDefinedFunction.prototype.toString = function () {
        return '<user-defined-function>';
    };

    // Energie!
    return SchemeUserDefinedFunction;
})(SchemeObject);


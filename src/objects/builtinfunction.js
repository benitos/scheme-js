var SchemeObject = require('./object'),
    SchemeSymbol = require('./symbol');

/**
 * Die Scheme Builtin Function
 * @param  {Object} _super Die Super-"Klasse"
 * @return {Object}        Scheme Builtin Function
 */
module.exports = (function (_super) {

    function SchemeBuiltinFunction (symbol, operation) {
        // Parent Constructor call
        _super.call(this);

        this.symbol = new SchemeSymbol(symbol);
        this.operation = operation;
    }

    // Erbe von SchemeObject
    SchemeBuiltinFunction.prototype = Object.create(_super.prototype);
    SchemeBuiltinFunction.prototype.constructor = SchemeBuiltinFunction;
    SchemeBuiltinFunction.prototype.isSchemeBuiltinFunction = true;
    SchemeBuiltinFunction.prototype.symbol = null;
    SchemeBuiltinFunction.prototype.operation = null;


    /** Ausgabe */
    SchemeBuiltinFunction.prototype.toString = function () {
        return '<builtin-function:'+ this.symbol.characters +'>';
    };

    // Energie!
    return SchemeBuiltinFunction;
})(SchemeObject);
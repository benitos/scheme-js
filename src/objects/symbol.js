var SchemeAtom = require('./atom');

/**
 * Das Scheme Symbol
 * @param  {Object} _super Die Super-"Klasse"
 * @return {Object}        Scheme Symbol
 */
module.exports = (function (_super) {

    function SchemeSymbol (characters) {
        // Parent Constructor call
        _super.call(this);
        
        this.characters = characters || '';
    }

    // Erbe von SchemeAtom
    SchemeSymbol.prototype = Object.create(_super.prototype);
    SchemeSymbol.prototype.constructor = SchemeSymbol;
    SchemeSymbol.prototype.isSchemeSymbol = true;
    SchemeSymbol.prototype.characters = '';

    /** Vergleich 2er Symbole */
    SchemeSymbol.prototype.equals = function (otherSymbol) {
        return otherSymbol.isSchemeSymbol ? this.characters === otherSymbol.characters : false;
    };

    /** Ausgabe */
    SchemeSymbol.prototype.toString = function () {
        return '<' + this.characters + '>';
    };

    // Energie!
    return SchemeSymbol;
})(SchemeAtom);
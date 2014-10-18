var SchemeAtom = require('./atom');

/**
 * Der Scheme String
 * @param  {Object} _super Die Super-"Klasse"
 * @return {Object}        Scheme String
 */
module.exports = (function (_super) {

    function SchemeString (characters) {
        // Parent Constructor call
        _super.call(this);
        
        this.characters = characters || '';
    }

    // Erbe von SchemeAtom
    SchemeString.prototype = Object.create(_super.prototype);
    SchemeString.prototype.constructor = SchemeString;
    SchemeString.prototype.isSchemeString = true;
    SchemeString.prototype.characters = '';

    /** Ausgabe */
    SchemeString.prototype.toString = function () {
        return '"' + this.characters + '"';
    };

    /** Vergleich 2er Strings */
    SchemeString.prototype.equals = function (schemeString) {
        return schemeString.isSchemeString ? this.characters === schemeString.characters : false;
    };

    // Energie!
    return SchemeString;
})(SchemeAtom);
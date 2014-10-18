var SchemeAtom = require('./atom');

/**
 * Das Scheme Nil
 * @param  {Object} _super Die Super-"Klasse"
 * @return {Object}        Scheme Nil
 */
module.exports = (function (_super) {

    function SchemeNil () {
        // Convenient Singleton
        if (SchemeNil.prototype._instance) {
            return SchemeNil.prototype._instance;
        }

        // Parent Constructor call
        _super.call(this);
        SchemeNil.prototype._instance = this;
    }

    // Erbe von SchemeAtom
    SchemeNil.prototype = Object.create(_super.prototype);
    SchemeNil.prototype.constructor = SchemeNil;
    SchemeNil.prototype.isSchemeNil = true;
    SchemeNil.prototype._instance = null;

    /** Ausgabe */
    SchemeNil.prototype.toString = function () {
        return 'nil';
    };

    /** Vergleich 2er nils */
    SchemeNil.prototype.equals = function (schemeNil) {
        return schemeNil.isSchemeNil ? true : false;
    };

    // Energie!
    return SchemeNil;
})(SchemeAtom);
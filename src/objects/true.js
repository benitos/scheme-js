var SchemeAtom = require('./atom');

/**
 * Das Scheme True
 * @param  {Object} _super Die Super-"Klasse"
 * @return {Object}        Scheme True
 */
module.exports = (function (_super) {

    function SchemeTrue () {
        // Convenient Singleton
        if (SchemeTrue.prototype._instance) {
            return SchemeTrue.prototype._instance;
        }

        // Parent Constructor call
        _super.call(this);
        SchemeTrue.prototype._instance = this;
    }

    // Erbe von SchemeAtom
    SchemeTrue.prototype = Object.create(_super.prototype);
    SchemeTrue.prototype.constructor = SchemeTrue;
    SchemeTrue.prototype.isSchemeTrue = true;
    SchemeTrue.prototype._instance = null;

    /** Ausgabe */
    SchemeTrue.prototype.toString = function () {
        return '#true';
    };

    /** Vergleich 2er trues */
    SchemeTrue.prototype.equals = function (schemeTrue) {
        return schemeTrue.isSchemeTrue ? true : false;
    };

    // Energie!
    return SchemeTrue;
})(SchemeAtom);
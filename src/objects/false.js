var SchemeAtom = require('./atom');

/**
 * Das Scheme False
 * @param  {Object} _super Die Super-"Klasse"
 * @return {Object}        Scheme False
 */
module.exports = (function (_super) {

    function SchemeFalse () {
        // Convenient Singleton
        if (SchemeFalse.prototype._instance) {
            return SchemeFalse.prototype._instance;
        }
        // Parent Constructor call
        _super.call(this);
        SchemeFalse.prototype._instance = this;
    }

    // Erbe von SchemeAtom
    SchemeFalse.prototype = Object.create(_super.prototype);
    SchemeFalse.prototype.constructor = SchemeFalse;
    SchemeFalse.prototype.isSchemeFalse = true;
    SchemeFalse.prototype._instance = null;

    /** Ausgabe */
    SchemeFalse.prototype.toString = function () {
        return '#false';
    };

    /** Vergleich 2er falses */
    SchemeFalse.prototype.equals = function (schemeFalse) {
        return schemeFalse.isSchemeFalse ? true : false;
    };

    // Energie!
    return SchemeFalse;
})(SchemeAtom);
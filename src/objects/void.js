var SchemeObject = require('./object');

/**
 * Das Scheme Void
 * @param  {Object} _super Die Super-"Klasse"
 * @return {Object}        Scheme Void
 */
module.exports = (function (_super) {

    function SchemeVoid () {
        // Parent Constructor call
        _super.call(this);
    }

    // Erbe von SchemeAtom
    SchemeVoid.prototype = Object.create(_super.prototype);
    SchemeVoid.prototype.constructor = SchemeVoid;
    SchemeVoid.prototype.isSchemeVoid = true;

    /** Ausgabe */
    SchemeVoid.prototype.toString = function () {
        return '';
    };

    /** Vergleich 2er voids */
    SchemeVoid.prototype.equals = function (SchemeVoid) {
        return SchemeVoid.isSchemeVoid ? true : false;
    };

    // Energie!
    return SchemeVoid;
})(SchemeObject);
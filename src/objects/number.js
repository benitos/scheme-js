var SchemeAtom = require('./atom');

/**
 * Der Scheme Number
 * @param  {Object} _super Die Super-"Klasse"
 * @return {Object}        Scheme Number
 */
module.exports = (function (_super) {

    function SchemeNumber (value) {
        // Parent Constructor call
        _super.call(this);
        
        this.value = value || 0;
    }

    // Erbe von SchemeAtom
    SchemeNumber.prototype = Object.create(_super.prototype);
    SchemeNumber.prototype.constructor = SchemeNumber;
    SchemeNumber.prototype.isSchemeNumber = true;
    SchemeNumber.prototype.value = 0;

    /** Ausgabe */
    SchemeNumber.prototype.toString = function () {
        return this.value;
    };

    /** Vergleich 2er Numbers */
    SchemeNumber.prototype.equals = function (schemeNumber) {
        return schemeNumber.isSchemeNumber ? this.value === schemeNumber.value : false;
    };

    // Energie!
    return SchemeNumber;
})(SchemeAtom);
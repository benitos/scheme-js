var SchemeObject = require('./object');

/**
 * Das Scheme Atom
 * @param  {Object} _super Die Super-"Klasse"
 * @return {Object} Scheme Atom
 */
module.exports = (function (_super) {

    function SchemeAtom() {
        // Parent Constructor call
        _super.call(this);
    }

    // Erbe von SchemeObject
    SchemeAtom.prototype = Object.create(_super.prototype);
    SchemeAtom.prototype.constructor = SchemeAtom;
    SchemeAtom.prototype.isSchemeAtom = true;

    return SchemeAtom;
})(SchemeObject);
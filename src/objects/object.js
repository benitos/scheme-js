/**
 * Das Scheme Super-Object
 * @return {Object} Scheme Object
 */
module.exports = (function () {

    function SchemeObject() {}

    SchemeObject.prototype.isSchemeObject = true;
    SchemeObject.prototype.isSchemeAtom   = false;
    SchemeObject.prototype.isSchemeNil    = false;
    SchemeObject.prototype.isSchemeVoid   = false;
    SchemeObject.prototype.isSchemeTrue   = false;
    SchemeObject.prototype.isSchemeFalse  = false;
    SchemeObject.prototype.isSchemeNumber = false;
    SchemeObject.prototype.isSchemeFloat  = false;
    SchemeObject.prototype.isSchemeString = false;
    SchemeObject.prototype.isSchemeSymbol = false;
    SchemeObject.prototype.isSchemeCons   = false;
    SchemeObject.prototype.isSchemeEnvironment         = false;
    SchemeObject.prototype.isSchemeBuiltinFunction     = false;
    SchemeObject.prototype.isSchemeUserDefinedFunction = false;


    /** Std-Ausgabe */
    SchemeObject.prototype.toString = function () {
        return '' + this.getType();
    };

    /**
     * Typ auslesen
     * @return {String}
     */
    SchemeObject.prototype.getType = function () {
        var funcNameRegex = /function (.{1,})\(/,
            results = (funcNameRegex).exec((this).constructor.toString());
        
        return (results && results.length > 1) ? results[1] : '';
    };

    /** Vergleich */
    SchemeObject.prototype.equals = function (schemeObject) {
        return this === schemeObject;
    };

    return SchemeObject;
})();
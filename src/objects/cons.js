var SchemeObject = require('./object'),
    SchemeNil    = require('./nil');

/**
 * Die Scheme Liste / Cons
 * @param  {Object} _super Die Super-"Klasse"
 * @return {Object}        Scheme Liste
 */
module.exports = (function (_super) {

    function SchemeCons (car, cdr) {
        // Parent Constructor call
        _super.call(this);
        
        this.car = car || new SchemeNil();
        this.cdr = cdr || new SchemeNil();
    }

    // Erbe von SchemeObject
    SchemeCons.prototype = Object.create(_super.prototype);
    SchemeCons.prototype.constructor = SchemeCons;
    SchemeCons.prototype.isSchemeCons = true;
    SchemeCons.prototype.car = null;
    SchemeCons.prototype.cdr = null;


    /** Cdr->car */
    SchemeCons.prototype.second = function () {
        if (this.cdr && this.cdr.isSchemeCons) {
            return this.cdr.car;
        } else {
            return new SchemeNil();
        }
    };

    /** Vergleich 2er conses */
    SchemeCons.prototype.equals = function (schemeCons) {
        return schemeCons.isSchemeCons ? this.car.equals(schemeCons.car) && this.cdr.equals(schemeCons.cdr) : false;
    };

    /** Ausgabe */
    SchemeCons.prototype.toString = function (inline) {
        var output;

        if (this.car.isSchemeNil && this.cdr.isSchemeNil) {
            return '()';
        } else {
            // return '(' + (this.car.toString() + ' ' + this.cdr.toString()) + ')';
            output = this.car.toString() + (this.cdr.isSchemeCons ? ' ' : ' . ') + this.cdr.toString(true);
            return inline ? output : '(' + output + ')';
        }
    };

    // Energie!
    return SchemeCons;
})(SchemeObject);
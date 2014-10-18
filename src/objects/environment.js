var SchemeObject = require('./object'),
    SchemeNil = require('./nil');

/**
 * Scheme Environment
 * @param  {Object} _super Die Super-"Klasse"
 * @return {Object}        Scheme Environment
 */
module.exports = (function (_super) {

    /**
     * Der Environment
     * @param {SchemeEnvironment} parentEnvironment Das Eltern-Environemnt
     */
    function SchemeEnvironment (parentEnvironment) {
        this.localBindings = {};
        this.parentEnvironment = parentEnvironment || null;
    }


    // Erbe von SchemeObject
    SchemeEnvironment.prototype = Object.create(_super.prototype);
    SchemeEnvironment.prototype.constructor = SchemeEnvironment;
    SchemeEnvironment.prototype.isSchemeEnvironment = true;
    SchemeEnvironment.prototype.localBindings = null;
    SchemeEnvironment.prototype.parentEnvironment = null;


    /**
     * Ein neues Binding hinzufügen
     * @param {SchemeSymbol} symbol Symbol, für das ein Binding angelegt werden soll
     * @param {SchemeObject} value Der Binding-Wert
     */
    SchemeEnvironment.prototype.addBindingFor = function (symbol, value) {
        if (!symbol.isSchemeSymbol) {
            throw 'addBindingFor: expected a `SchemeSymbol` but got something else (' + (typeof symbol) + ')!';
        }
        if (this.localBindings[symbol.toString()]) {
            throw 'addBindingFor: binding for "' + symbol.toString() + '" already exists!';
        }

        this.localBindings[symbol.toString()] = {
            key: symbol,
            value: value
        };
    };


    /**
     * Ein Binding für ein Symbol auflösen
     * @param  {SchemeSymbol} symbol Das Symbol
     * @param  {Boolean} onlyLocal Nur im lokalen Environment nachsehen?
     * @return {[Mixed}
     */
    SchemeEnvironment.prototype.getBindingFor = function (symbol, onlyLocal) {
        if (!symbol.isSchemeSymbol) {
            throw 'getBindingFor: expected a `SchemeSymbol` but got something else (' + (typeof symbol) + ')!';
        }
        // Binding suchen
        if (this.localBindings[symbol.toString()]) {
            return this.localBindings[symbol.toString()].value;
        }

        // Nichts gefunden? -> Parent Environment durchsuchen
        if (!onlyLocal && this.parentEnvironment) {
            return this.parentEnvironment.getBindingFor(symbol);
        }
        
        return new SchemeNil(); // null?
    };


    /**
     * Ein bestehendes Binding abändern
     * @param  {SchemeSymbol} symbol     Das Symbol des Bindings, das geändert werden soll
     * @param  {SchemeObject} newValue   Der neue Binding-Wert
     */
    SchemeEnvironment.prototype.changeBindingFor = function (symbol, newValue) {
        if (!symbol.isSchemeSymbol) {
            throw 'changeBindingFor: expected a `SchemeSymbol` but got something else (' + (typeof symbol) + ')!';
        }

        this.localBindings[symbol.toString()] = {
            key: symbol,
            value: newValue
        };
    };



    /** Ausgabe */
    SchemeEnvironment.prototype.toString = function () {
        var self = this;
        var bindings = Object.keys(this.localBindings).reduce(function (previousValue, currentValue, index, array) {
            return previousValue + '\n\t' + currentValue + ': \t' + self.localBindings[currentValue].value.toString();
        }, '');

        return 'Bindings: ' + bindings + ' \nParent: ' + (this.parentEnvironment ? this.parentEnvironment.toString() : 'none');
    };


    // Energie!
    return SchemeEnvironment;

})(SchemeObject);
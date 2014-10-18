var SchemePrinter = require('./printer');
var colors = require('colors');

/**
 * Scheme PrinterConsole
 * @param  {Object} _super Die Super-"Klasse"
 * @return {Object}        SchemePrinterConsole
 */
module.exports = (function (_super) {

    /**
     * Konsolen Ausgabe
     */
    function SchemePrinterConsole () {
        // Parent Constructor call
        _super.call(this);
    }

    // Erbe von SchemePrinter
    SchemePrinterConsole.prototype = Object.create(_super.prototype);
    SchemePrinterConsole.prototype.constructor = SchemePrinterConsole;

    
    /**
     * Der eigentliche SchemeObject-Printer
     * @param  {SchemeObject} schemeObject Das auszugebende Scheme Objekt
     */
    SchemePrinterConsole.prototype.print = function (schemeObject) {
        var pre;
        if (schemeObject.isSchemeVoid) { return; }  // Voids werden nicht ausgegeben :)
    
        pre = this.debugMode ? ('(' + schemeObject.getType() + ') \t').blue : '';
        return this.printString( pre + ('' + schemeObject.toString()).green );
        // return this.printString(('(' + schemeObject.getType() + ') \t').blue + (schemeObject.toString() + '').green);
    };

    /**
     * Ausgabe von Fehlern
     * @param  {String} string Die Fehlermeldung
     */
    SchemePrinterConsole.prototype.printError = function (string) {
        return this.printString(('Error: '.red) + string.magenta);
    };

    /**
     * Auf der Console ausgeben
     * @param  {String} string Die Ausgabe
     * @param  {String} type Optionaler Typ
     */
    SchemePrinterConsole.prototype.printString = function (string, type) {
        var output = '      ' + string;
        console.log(output);

        return output;
    };


    /**
     * Ausgabe der Begrüßungs-Nachricht
     */
    SchemePrinterConsole.prototype.printWelcomeMsg = function () {
        return this.printString(
            ('\n\t------------------------------------------' +
            '\n\t|          ').green + ('Welcome to scheme-js').white + ('          |'+
            '\n\t|           ').green + ('Enter `:q` to quit.').white + ('          |'+
            '\n\t------------------------------------------\n').green);
    };

    /**
     * Ausgabe der Ende-Nachricht
     */
    SchemePrinterConsole.prototype.printExitMsg = function () {
        return this.printString('Goodbye ...'.green);
    };

    // Energie
    return SchemePrinterConsole;
})(SchemePrinter);
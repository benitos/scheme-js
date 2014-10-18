/**
 * Scheme Printer
 */
module.exports = (function () {

    /**
     * Der Printer
     */
    function SchemePrinter () {
        this.debugMode = false;
    }

    /**
     * Der eigentliche SchemeObject-Printer
     * @param  {SchemeObject} schemeObject Das auszugebende Scheme Objekt
     */
    SchemePrinter.prototype.print = function (schemeObject) {
        var pre;
        if (schemeObject.isSchemeVoid) { return; }  // Voids werden nicht ausgegeben :)

        pre = this.debugMode ? '(' + schemeObject.getType() + ') \t' : '';
        return this.printString( pre + schemeObject.toString() );
    };

    /**
     * Ausgabe von Fehlern
     * @param  {String} string Die Fehlermeldung
     */
    SchemePrinter.prototype.printError = function (string) {
        return this.printString('Error: ' + string, 'error');
    };

    /**
     * Die letztendliche Ausgabe von Strings
     * @param  {String} string Die auszugebende Zeichenkette
     * @param  {String} type Optionaler Typ
     */
    SchemePrinter.prototype.printString = function (string, type) {
        return string;
    };





    /**
     * Ausgabe der Begrüßungs-Nachricht
     */
    SchemePrinter.prototype.printWelcomeMsg = function () {
        return this.printString('Hello ...');
    };

    /**
     * Ausgabe der Ende-Nachricht
     */
    SchemePrinter.prototype.printExitMsg = function () {
        return this.printString('Goodbye ...');
    };


    // Energie
    return SchemePrinter;
})();
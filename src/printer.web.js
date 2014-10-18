var SchemePrinter = require('./printer');

/**
 * Scheme PrinterWeb
 * @param  {Object} _super Die Super-"Klasse"
 * @return {Object}        SchemePrinterWeb
 */
module.exports = (function (_super) {

    /**
     * Web Ausgabe
     * @param {Object} target DOM-Knoten, an den die Ausgabe angehaengt werden soll
     */
    function SchemePrinterWeb (target) {
        // Parent Constructor call
        _super.call(this);
        
        this.target = target;
    }

    // Erbe von SchemePrinter
    SchemePrinterWeb.prototype = Object.create(_super.prototype);
    SchemePrinterWeb.prototype.constructor = SchemePrinterWeb;

    SchemePrinterWeb.prototype.target = null;

    /**
     * Im Web ausgeben
     * @param  {String} string Die Ausgabe
     */
    SchemePrinterWeb.prototype.printString = function (string, type) {
        var target = this.target,
            output;

        output = this.convert2HTML(string, type);

        target.innerHTML += output;
        target.scrollTop = target.scrollHeight;

        return output;
    };

    /**
     * Ausgabe-Konvertierung
     * @param  {String} string Die Ausgabe
     * @return {String}
     */
    SchemePrinterWeb.prototype.convert2HTML = function (string, type) {
        string = (type === 'raw' ? string : this.encodeHTMLEntities(string))
                    .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
                    .replace(/\n/g, '<br>')
                    .replace(/\s/g, '&nbsp;');

        return '<span class="line ' + (type ? type : '') + '">' + string + '</span>';
    };

    /**
     * Encoding für Sonderzeichen etc.
     * @param  {String} string Eingabe
     * @return {String}
     */
    SchemePrinterWeb.prototype.encodeHTMLEntities = function (string) {
        // Universell und schnell:
        return string.replace(/([^\u0020-\u007E\t\n]|["&\'<>])/gim, function(char) {
           return '&#' + char.charCodeAt(0) + ';';
        });

        // Simpel:
        // return string.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

        // Universell, aber langsam (benoetigt DOM):
        // var document = window.document;
        // var div = document.createElement('div');
        // var text = document.createTextNode(string);
        // div.appendChild(text);
        // return div.innerHTML;
    };

    // Energie
    return SchemePrinterWeb;
})(SchemePrinter);
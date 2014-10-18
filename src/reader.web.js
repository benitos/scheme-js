var SchemeReader = require('./reader');
var SchemeParser = require('./parser');


/**
 * Scheme Web Reader
 * @param  {Object} _super Die Super-"Klasse"
 * @return {Object}        SchemeReaderWeb
 */
module.exports = (function (_super) {

    /**
     * Web Eingabe
     * @param {Object} inputStream DOM-Knoten für die Eingabe (Input Element)
     */
    function SchemeReaderWeb (inputStream) {
        // Parent Constructor call
        _super.call(this);

        // Listener
        inputStream.addEventListener('data', function (evt) {
            data = evt.detail.trim();
            this.emit('print', data.replace(/\n/g, '\n&raquo; '));

            // Beenden
            if(data === ':q') {
                this.emit('end');
                return;
            } else {
                // Verarbeitung anstossen - begin = cheap multistatements :)
                this.emit('data', this.read(new SchemeParser(data ? '(begin ' + data + ')' : data)));
            }
        }.bind(this));


        this.rawInput = inputStream;
    }

    // Erbe von SchemeReader
    SchemeReaderWeb.prototype = Object.create(_super.prototype);
    SchemeReaderWeb.prototype.constructor = SchemeReaderWeb;

    // Energie
    return SchemeReaderWeb;
})(SchemeReader);
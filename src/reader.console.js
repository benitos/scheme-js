var ReadLine    = require('readline');
var SchemeReader = require('./reader');
var SchemeParser = require('./parser');


/**
 * Scheme Console Reader
 * @param  {Object} _super Die Super-"Klasse"
 * @return {Object}        SchemeReaderConsole
 */
module.exports = (function (_super) {

    /**
     * Konsolen Eingabe
     */
    function SchemeReaderConsole () {
        var reader;

        // Parent Constructor call
        _super.call(this);

        // Reader bauen
        // http://nodejs.org/api/readline.html
        reader = this.rawInput = ReadLine.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        reader.setPrompt('sjs › ');
        reader.on('line', function (line) {
            line = line.trim();

            // Beenden
            if(line === ':q') {
                this.emit('end');
                reader.close();
                return;
            } else {
                // Verarbeitung anstossen
                try {
                    this.emit('data', this.read(new SchemeParser(line)));
                } catch (error) {
                    this.emit('error', error);
                }
            }

            reader.prompt();
        }.bind(this));

        reader.prompt();
    }

    // Erbe von SchemeReader
    SchemeReaderConsole.prototype = Object.create(_super.prototype);
    SchemeReaderConsole.prototype.constructor = SchemeReaderConsole;

    // Energie
    return SchemeReaderConsole;
})(SchemeReader);
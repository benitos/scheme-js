var fs = require('fs'),
    path = require('path');

// Strage bug - Object.create schlaegt fehl, weil SchemeReader ein Objekt und 
// keine Funktion mehr ist - scheint mit vorherigem require / call zusammen zu haengen
delete require.cache[require.resolve('./reader.js')];

var SchemeReader = require('./reader');
var SchemeParser = require('./parser');


/**
 * Scheme File Reader
 * @param  {Object} _super Die Super-"Klasse"
 * @return {Object}        SchemeReaderFile
 */
module.exports = (function (_super) {

    /**
     * File Eingabe
     */
    function SchemeReaderFile () {
        // Parent Constructor call
        _super.call(this);
    }

    // Erbe von SchemeReader
    SchemeReaderFile.prototype = Object.create(_super.prototype);
    SchemeReaderFile.prototype.constructor = SchemeReaderFile;

    SchemeReaderFile.prototype.file = null;

    SchemeReaderFile.prototype.readFile = function (file) {
        var content,
            result;

        // Convenience > Security in diesem Fall O:)
        // Pfad absichern - nur einlesen von Dateien im Verzeichnis der app
        // file = path.join('/', file);
        // file = this.rawInput = path.join('./', file);
        file = path.resolve(file);

        // Datei existiert?
        if (!fs.existsSync(file)) {
            throw '(readFile): `'+ file +'` is not a file';
        }

        // Einlesen & evaluieren
        try {
            content = fs.readFileSync(file, 'utf8');
        } catch (error) {
            throw '(readFile): error reading `'+ file +'`! (' + error + ')';
        }
        result = this.read(new SchemeParser('(begin ' + content + ')'));

        // Listener benachrichtigen
        this.emit('print', result);
        this.emit('data', result);

        return result;
    };

    // Energie
    return SchemeReaderFile;
})(SchemeReader);
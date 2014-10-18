


/**
 * SchemeParser für Strings
 */
module.exports = (function () {

    /**
     * SchemeParser für Strings
     * @param {String} string Der zu parsende String
     */
    function SchemeParser (string) {
        var type = typeof string;
        if (type !== 'string') {
            throw 'SchemeParser expected a string but got ' + type + '!';
        }

        // Normalize für Newlines (Win/Unix)
        this.string = string.replace(/\r\n/g, '\n');
        this.currentIndex = 0;

        if (string.length < 1) {
            return;     // throw 'SchemeParser expected a non-empty string!';
        }
    }

    SchemeParser.prototype.string = null;
    SchemeParser.prototype.currentIndex = 0;


    /**
     * Ein Zeichen einlesen
     * @return {String} Das Zeichen
     */
    SchemeParser.prototype.peekCharacter = function () {
        if (this.EOS()) {
            return;     // throw 'PeekCharacter: index out of bounds!';
        }

        return this.string.charAt(this.currentIndex);
    };

    /**
     * Zukunftsmusik - das Zeichen an Stelle `currentIndex + x` einlesen
     * @param {Number} ahead Anzahl der zu vorausschauenden Zeichen
     * @return {String} Das angeforderte Zeichen
     */
    SchemeParser.prototype.peekAhead = function (ahead) {
        var newIndex = this.currentIndex + ahead;

        if (this.outOfBounds(newIndex)) {
            return;     // throw 'PeekAhead: index out of bounds!';
        }

        return this.string.charAt(newIndex);
    };


    /**
     * Ein Zeichen einlesen und den Pointer weiter schieben
     * @return {String} Das Zeichen
     */
    SchemeParser.prototype.readCharacter = function () {
        if (this.EOS()) {
            return;     // throw 'ReadCharacter: index out of bounds!';
        }
        
        return this.string.charAt(this.currentIndex++);
    };


    /**
     * Überspringe Zeichen, die auf den regulären Ausdruck matchen
     * @param  {RegularExpression} regex Der reguläre Ausdruck
     */
    SchemeParser.prototype.skip = function (regex) {
        while(!this.EOS() && regex.test(this.peekCharacter())) {
            this.currentIndex++;
        }
    };

    /**
     * End of string
     * Kurze Prüfung, ob wir noch innerhalb der Bounds sind
     * @return {Boolean} 
     */
    SchemeParser.prototype.EOS = function () {
        return this.outOfBounds(this.currentIndex);
    };


    /**
     * Prüft, ob angeforderter Index noch in Bounds ist
     * (prüft sicherheitshalber auch < 0)
     * @param  {Number} index Der gewünschte Index
     * @return {Boolean} 
     */
    SchemeParser.prototype.outOfBounds = function (index) {
        return (index >= this.string.length || index < 0);
    };


    // Energie
    return SchemeParser;
})();
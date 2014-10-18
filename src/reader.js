var EventEmitter = require('events').EventEmitter;
var util = require('util');

var SchemeParser = require('./parser'),
    SchemeNil    = require('./objects/nil'),
    SchemeVoid   = require('./objects/void'),
    SchemeTrue   = require('./objects/true'),
    SchemeFalse  = require('./objects/false'),
    SchemeNumber = require('./objects/number'),
    SchemeString = require('./objects/string'),
    SchemeSymbol = require('./objects/symbol'),
    SchemeCons   = require('./objects/cons'),
    SchemeBuiltinFunction     = require('./objects/builtinfunction'),
    SchemeUserDefinedFunction = require('./objects/userdefinedfunction');


/**
 * Scheme Reader
 */
module.exports = (function (_super) {

    /**
     * Der Reader
     */
    function SchemeReader () {
        this.reservedWords['sjs.debug'] = function () { this.emit('cmd', 'debugMode'); return new SchemeVoid(); }.bind(this);

        // Regex für reservedWords generieren
        this.regex.reservedWords = new RegExp('^' + (Object.keys(this.reservedWords).join('|')) + '$');
    }

    // Erbe von EventEmitter
    SchemeReader.prototype = Object.create(_super.prototype);
    SchemeReader.prototype.constructor = SchemeReader;
    // Events:
    // data - bei neuen Eingaben
    // end - bei Beenden

    SchemeReader.prototype.rawInput = null;
    SchemeReader.prototype.knownSymbols = {};
    SchemeReader.prototype.regex = {
        comment:    /^;/,
        atom: /^[^\(\)\s\n'";]/,
        number: /^(\.|\+|-)?\d+((\.|e(\+|-)?)\d+){0,2}/,
        cons: {
            start:      /^\(/,
            separator:  /\./,
            end:        /\)$/
        },
        quote:      /^'/,
        string:     /^"/,
        separator:  /\s|\\n/,
        //reservedWords werden im Constructor generiert
    };

    // Reservierte Wörter können direkt verarbeitet werden,
    // ohne unnötige weitere Schritte (eval, ...) zu durchlaufen
    SchemeReader.prototype.reservedWords = {
        'sjs.memory': function () { return new SchemeString(util.inspect(process.memoryUsage())); },
        'sjs.env': function () { return new SchemeString(util.inspect(process.env)); },
        'sjs.uptime': function () { return new SchemeString('Current uptime: ' + process.uptime() + ' seconds'); },
        //'sjs.debug': function () { console.log(this); this.emit('cmd', 'debugMode'); }.bind(this),

        nil: function () { return new SchemeNil(); },
        true: function () { return new SchemeTrue(); },
        false: function () { return new SchemeFalse(); }
    };
    // Alias
    SchemeReader.prototype.reservedWords['#t'] = SchemeReader.prototype.reservedWords['true'];
    SchemeReader.prototype.reservedWords['#f'] = SchemeReader.prototype.reservedWords['false'];


    /**
     * Proxy für die verschiedenen Read-Funktionen
     * @param {SchemeParser} input Die Eingabe
     * @return {Mixed}
     */
    SchemeReader.prototype.read = function (input) {
        var regex = this.regex,
            currentChar = input.peekCharacter();

        // Übergehe Separatoren am Anfang
        input.skip(regex.separator);

        if (currentChar) {
            if (regex.string.test(currentChar)) {
                return this.readString(input);
            } else if (currentChar && regex.atom.test(currentChar)) {   // Der Regex matcht auch auf leere Strings
                return this.readAtom(input);
            } else if (regex.cons.start.test(currentChar)) {
                return this.readCons(input);
            } else if(regex.comment.test(currentChar)) {
                return this.readComment(input);
            } else if (regex.quote.test(currentChar)) {
                return this.readQuote(input);
            }
        }

        return new SchemeVoid();
    };


    /**
     * String einlesen
     * @param {SchemeParser} input Die Eingabe
     * @return {SchemeString}
     */
    SchemeReader.prototype.readString = function (input) {
        var regex = this.regex,
            chars = '';

        // String Delimiter überspringen
        input.readCharacter();

        // String einlesen 
        while(!input.EOS()) {
            if(!regex.string.test(input.peekCharacter())) {
                chars += input.readCharacter();
            } else {
                // String delimiter überspringen
                input.readCharacter();
                break;
            }
        }

        return new SchemeString(chars);
    };


    /**
     * SchemeAtom (Number/Symbol/...) einlesen
     * @return {Mixed}
     */
    SchemeReader.prototype.readAtom = function (input) {
        var regex = this.regex,
            chars = '',
            reservedWord;

        // String einlesen
        while(!input.EOS() && regex.atom.test(input.peekCharacter())) {
            chars += input.readCharacter();
        }

        // Auf reservierte Wörter prüfen
        reservedWord = chars.match(regex.reservedWords);
        if (reservedWord) {
            return this.reservedWords[reservedWord[0]](chars);
        }

        // Auf Zahl prüfen
        if (regex.number.test(chars)) {
            return new SchemeNumber(global['parse' + (chars.indexOf('.') ? 'Float' : 'Int')].call(null, chars, 10));
        }

        return new SchemeSymbol(chars);

    };

    /**
     * Cons einlesen
     * @param {SchemeParser} input Die Eingabe
     * @return {SchemeCons}
     */
    SchemeReader.prototype.readCons = function (input) {
        var regex = this.regex,
            car, cdr;

        // Cons Delimiter überspringen
        // Check da sonst bei rekursivem Call zu viel überlesen wird
        // if (regex.cons.start.test(input.peekCharacter())) {
        //     input.readCharacter();
        // }
        input.readCharacter();
        input.skip(regex.separator);

        // Leere Listen abfangen
        if (regex.cons.end.test(input.peekCharacter())) {
            input.readCharacter();
            return new SchemeNil();
        }

        // Liste zusammenbauen
        car = this.read(input);
        input.skip(regex.separator);

        // Punkte abfangen
        if (regex.cons.separator.test(input.peekCharacter())) {
            input.readCharacter();
            cdr = this.read(input);
            input.skip(regex.separator);

            // Fehler abfangen
            if (!regex.cons.end.test(input.peekCharacter())) {
                throw 'Expected not to see anything after "."!';
            }

            // Abschließenden Delimiter überspringen
            //input.readCharacter();
        } else {
            cdr = this.readConsCdr(input);
        }

        return new SchemeCons(car, cdr);
    };

    /**
     * Cdr des Cons einlesen
     * @param {SchemeParser} input Die Eingabe
     * @return {SchemeCons}
     */
    SchemeReader.prototype.readConsCdr = function (input) {
        var regex = this.regex,
            car, cdr;
        
        input.skip(regex.separator);

        // Fehler abfangen
        if (input.EOS()) {
            throw 'Syntax error - premature end of string (`'+ input.string +'`)!';
        }

        // Leere Listen abfangen
        if (regex.cons.end.test(input.peekCharacter())) {
            input.readCharacter();
            return new SchemeNil();
        }

        // Liste zusammenbauen
        car = this.read(input);
        input.skip(regex.separator);

        cdr = this.readConsCdr(input);
        return new SchemeCons(car, cdr);
    };

    /** 
     * Kommentar ein- bzw. überlesen
     * @param {SchemeParser} input Die Eingabe
     */
    SchemeReader.prototype.readComment = function (input) {
        var regex = this.regex,
            currentChar = input.peekCharacter();

        while(!(input.EOS() || /\n/.test(currentChar))) {
            currentChar = input.readCharacter();
        }
        input.skip(regex.separator);

        return this.read(input);
    };

    /**
     * Quote Helper, um quote mittles Shorthand `'` benutzen zu koennen
     * @param {SchemeParser} input Die Eingabe
     * @return {SchemeCons}
     */
    SchemeReader.prototype.readQuote = function (input) {
        var regex = this.regex,
            expression,
            quoted;

        // Quote delimiter überspringen
        input.readCharacter();
        input.skip(regex.separator);

        // Zusammenstückeln
        expression = this.read(input);
        quoted = new SchemeCons(expression, new SchemeNil());

        return new SchemeCons(new SchemeSymbol('quote'), quoted);
    };

    // Energie
    return SchemeReader;
})(EventEmitter);
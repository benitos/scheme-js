var EventEmitter = require('events').EventEmitter;

var SchemeReaderConsole  = require('./reader.console'),
    SchemePrinterConsole = require('./printer.console'),
    SchemeEvaluator = require('./evaluator'),
    SchemeParser    = require('./parser');


/**
 * Scheme REPL
 */
module.exports = (function (_super) {

    /**
     * Die REPL
     */
    function SchemeREPL (reader, printer) {
        // Der Reader
        this.reader = reader || new SchemeReaderConsole();

        // Der Evaluator
        this.evaluator = new SchemeEvaluator();

        // Der Printer
        this.printer = printer || new SchemePrinterConsole();
        this.printer.printWelcomeMsg();

        // REPL
        try {
            // Input verarbeiten
            this.reader.on('data', function (string) {
                var evaluated;
                try {
                    evaluated = this.evaluator.eval(string);
                    this.printer.print(evaluated);
                    this.emit('update', evaluated);
                } catch (error) {
                    this.printer.printError(error);
                }
            }.bind(this));

            // Ausgabe vom Reader?
            this.reader.on('print', function (string) {
                this.printer.printString('» ' + string, 'raw');
            }.bind(this));

            // Steuerbefehl?
            this.reader.on('cmd', function (cmd) {
                switch (cmd) {
                    case 'debugMode':
                        this.printer.debugMode = !this.printer.debugMode;
                        this.printer.printString('» debugMode: ' + this.printer.debugMode);
                        break;

                    default:
                        throw '(cmd): unknown command `' + cmd + '`!';
                }
            }.bind(this));

            // Exit-Nachricht ausgeben
            this.reader.on('end', function () {
                this.printer.printExitMsg();
            }.bind(this));

            // Fehler?
            this.reader.on('error', function (error) {
                this.printer.printError(error);
            }.bind(this));
        } catch(error) {
            this.printer.printError(error);
        }
    }


    // Erbe von EventEmitter
    SchemeREPL.prototype = Object.create(_super.prototype);
    SchemeREPL.prototype.constructor = SchemeREPL;

    // Energie
    return SchemeREPL;
})(EventEmitter);
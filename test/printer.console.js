/**
 * Tests für den Console Printer
 */

var chai = require('chai'),
    expect = chai.expect;

var SchemePrinterConsole = require('../src/printer.console');
var SchemeString = require('../src/objects/string');


describe('SchemePrinterConsole', function () {
    var printer = new SchemePrinterConsole();

    it('should have a `debugMode` property', function () {
        expect(printer).to.have.a.property('debugMode');
        expect(printer.debugMode).to.be.a('boolean');
        expect(printer.debugMode).to.be.false;
    });

    it('should have a `print` function', function () {
        expect(printer).to.have.a.property('print');
        expect(printer.print).to.be.a('function');
    });

    it('should hae a `printString` function', function () {
        expect(printer).to.have.a.property('printString');
        expect(printer.printString).to.be.a('function');
    });

    it('should hae a `printError` function', function () {
        expect(printer).to.have.a.property('printError');
        expect(printer.printError).to.be.a('function');
    });

    it('should hae a `printWelcomeMsg` function', function () {
        expect(printer).to.have.a.property('printWelcomeMsg');
        expect(printer.printWelcomeMsg).to.be.a('function');
    });

    it('should hae a `printExitMsg` function', function () {
        expect(printer).to.have.a.property('printExitMsg');
        expect(printer.printExitMsg).to.be.a('function');
    });


    // Funktionen
    describe('.print()', function () {
        it('should print SchemeObjects', function () {
            var result = printer.print(new SchemeString('test'));
            expect(result).to.equal('      \u001b[32m"test"\u001b[39m');
        });

        it('should print SchemeObjects with type in debugMode', function () {
            var result;
            printer.debugMode = true;
            result = printer.print(new SchemeString('test'));
            expect(result).to.equal('      \u001b[34m(SchemeString) \t\u001b[39m\u001b[32m"test"\u001b[39m');
        });
    });

    describe('.printString()', function () {
        it('should print a string', function () {
            expect(printer.printString('test')).to.equal('      test');
        });
    });

    describe('.printError()', function () {
        it('should print an error', function () {
            expect(printer.printError('test')).to.equal('      \u001b[31mError: \u001b[39m\u001b[35mtest\u001b[39m');
        });
    });

    describe('.printWelcomeMsg()', function () {
        it('should print a welcome message', function () {
            expect(printer.printWelcomeMsg()).to.equal('      \u001b[32m\n\t------------------------------------------\n\t|          \u001b[39m\u001b[37mWelcome to scheme-js\u001b[39m\u001b[32m          |\n\t|           \u001b[39m\u001b[37mEnter `:q` to quit.\u001b[39m\u001b[32m          |\n\t------------------------------------------\n\u001b[39m');
        });
    });

    describe('.printExitMsg()', function () {
        it('should print an exit message', function () {
            expect(printer.printExitMsg()).to.equal('      \u001b[32mGoodbye ...\u001b[39m');
        });
    });
});
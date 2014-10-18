/**
 * Tests für den Printer
 */

var chai = require('chai'),
    expect = chai.expect;

var SchemePrinter = require('../src/printer');
var SchemeString = require('../src/objects/string');


describe('SchemePrinter', function () {
    var printer = new SchemePrinter();

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
            expect(result).to.equal('"test"');
        });

        it('should print SchemeObjects with type in debugMode', function () {
            var result;
            printer.debugMode = true;
            result = printer.print(new SchemeString('test'));
            expect(result).to.equal('(SchemeString) \t"test"');
        });
    });

    describe('.printString()', function () {
        it('should print a string', function () {
            expect(printer.printString('test')).to.equal('test');
        });
    });

    describe('.printError()', function () {
        it('should print an error', function () {
            expect(printer.printError('test')).to.equal('Error: test');
        });
    });

    describe('.printWelcomeMsg()', function () {
        it('should print a welcome message', function () {
            expect(printer.printWelcomeMsg()).to.equal('Hello ...');
        });
    });

    describe('.printExitMsg()', function () {
        it('should print an exit message', function () {
            expect(printer.printExitMsg()).to.equal('Goodbye ...');
        });
    });
});
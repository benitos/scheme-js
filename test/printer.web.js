/**
 * Tests für den Web Printer
 */

var chai = require('chai'),
    expect = chai.expect;

var SchemePrinterWeb = require('../src/printer.web');
var SchemeString = require('../src/objects/string');


describe('SchemePrinterWeb', function () {
    var targetMock = { innerHTML: '', scrollTop: 0 };
    var printer = new SchemePrinterWeb(targetMock);

    it('should have a `target` property', function () {
        expect(printer).to.have.a.property('target');
        expect(printer.target).to.be.an('object');
        expect(printer.target).to.have.a.property('innerHTML');
        expect(printer.target.innerHTML).to.equal(targetMock.innerHTML);
    });

    it('should have a `debugMode` property', function () {
        expect(printer).to.have.a.property('debugMode');
        expect(printer.debugMode).to.be.a('boolean');
        expect(printer.debugMode).to.be.false;
    });

    it('should have a `print` function', function () {
        expect(printer).to.have.a.property('print');
        expect(printer.print).to.be.a('function');
    });

    it('should have a `printString` function', function () {
        expect(printer).to.have.a.property('printString');
        expect(printer.printString).to.be.a('function');
    });

    it('should have a `printError` function', function () {
        expect(printer).to.have.a.property('printError');
        expect(printer.printError).to.be.a('function');
    });

    it('should have a `printWelcomeMsg` function', function () {
        expect(printer).to.have.a.property('printWelcomeMsg');
        expect(printer.printWelcomeMsg).to.be.a('function');
    });

    it('should have a `printExitMsg` function', function () {
        expect(printer).to.have.a.property('printExitMsg');
        expect(printer.printExitMsg).to.be.a('function');
    });

    it('should have a `convert2HTML` function', function () {
        expect(printer).to.have.a.property('convert2HTML');
        expect(printer.convert2HTML).to.be.a('function');
    });

    it('should have a `encodeHTMLEntities` function', function () {
        expect(printer).to.have.a.property('encodeHTMLEntities');
        expect(printer.encodeHTMLEntities).to.be.a('function');
    });


    // Funktionen
    describe('.print()', function () {
        it('should print SchemeObjects', function () {
            var result = printer.print(new SchemeString('test'));
            expect(result).to.equal('<span class="line ">&#34;test&#34;</span>');
        });

        it('should print SchemeObjects with type in debugMode', function () {
            var result;
            printer.debugMode = true;
            result = printer.print(new SchemeString('test'));
            expect(result).to.equal('<span class="line ">(SchemeString)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#34;test&#34;</span>');
        });
    });

    describe('.printString()', function () {
        it('should insert a string into the target html element', function () {
            targetMock.innerHTML = '';
            expect(printer.target).to.deep.equal(targetMock);
            printer.printString('test');
            expect(targetMock.innerHTML).to.equal('<span class="line ">test</span>');
        });
    });

    describe('.printError()', function () {
        it('should print an error', function () {
            expect(printer.printError('test')).to.equal('<span class="line error">Error:&nbsp;test</span>');
        });
    });

    describe('.printWelcomeMsg()', function () {
        it('should print a welcome message', function () {
            expect(printer.printWelcomeMsg()).to.equal('<span class="line ">Hello&nbsp;...</span>');
        });
    });

    describe('.printExitMsg()', function () {
        it('should print an exit message', function () {
            expect(printer.printExitMsg()).to.equal('<span class="line ">Goodbye&nbsp;...</span>');
        });
    });

    describe('.convert2HTML()', function () {
        it('should wrap the string within a span', function () {
            expect(printer.convert2HTML('Dies ist ein super toller Test!')).to.equal('<span class="line ">Dies&nbsp;ist&nbsp;ein&nbsp;super&nbsp;toller&nbsp;Test!</span>');
        });

        it('should replace tabs with 4 &nbsp;s', function () {
            expect(printer.convert2HTML('\t')).to.equal('<span class="line ">&nbsp;&nbsp;&nbsp;&nbsp;</span>');
        });

        it('should replace newlines with <br>s', function () {
            expect(printer.convert2HTML('\n')).to.equal('<span class="line "><br></span>');
        });

        it('should replace spaces with &nbsp;s', function () {
            expect(printer.convert2HTML(' ')).to.equal('<span class="line ">&nbsp;</span>');
        });

        it('should encode html entities', function () {
            expect(printer.convert2HTML('<>&')).to.equal('<span class="line ">&#60;&#62;&#38;</span>');
        });

        it('should add a class name', function () {
            expect(printer.convert2HTML('Dies ist \t ein super toller\n Test<!', 'error')).to.equal('<span class="line error">Dies&nbsp;ist&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ein&nbsp;super&nbsp;toller<br>&nbsp;Test&#60;!</span>');
        });

        it('should not encode raw strings', function () {
            expect(printer.convert2HTML('Dies ist \t ein super toller\n Test<!', 'raw')).to.equal('<span class="line raw">Dies&nbsp;ist&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ein&nbsp;super&nbsp;toller<br>&nbsp;Test<!</span>');
        });
    });

    describe('.encodeHTMLEntities()', function () {
        it('should encode html entities', function () {
            expect(printer.encodeHTMLEntities('<>&')).to.equal('&#60;&#62;&#38;');
        });
    });
});
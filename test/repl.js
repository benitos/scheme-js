/**
 * Tests für die REPL
 */

var chai = require('chai'),
    expect = chai.expect;

var SchemeREPL = require('../src/repl');
var SchemeReader = require('../src/reader');
var SchemeEvaluator = require('../src/evaluator');
var SchemePrinter = require('../src/printer');


describe('SchemeREPL', function () {
    var reader = new SchemeReader();
    var printer = new SchemePrinter();
    var repl = new SchemeREPL(reader, printer);
    
    it('should have a `reader` property', function () {
        expect(repl).to.have.a.property('reader');
        expect(repl.reader).to.be.an.instanceOf(SchemeReader);
        expect(repl.reader).to.deep.equal(reader);
    });
    
    it('should have a `evaluator` property', function () {
        expect(repl).to.have.a.property('evaluator');
        expect(repl.evaluator).to.be.an.instanceOf(SchemeEvaluator);
    });
    
    it('should have a `printer` property', function () {
        expect(repl).to.have.a.property('printer');
        expect(repl.printer).to.be.an.instanceOf(SchemePrinter);
        expect(repl.printer).to.deep.equal(printer);
    });
});
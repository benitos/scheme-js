/**
 * Tests für SchemeObject
 */

var chai = require('chai'),
    expect = chai.expect;

var SchemeBuiltinFunction = require('../../src/objects/builtinfunction'),
    SchemeSymbol = require('../../src/objects/symbol');

describe('SchemeBuiltinFunction', function () {
    var schemeBuiltinFunction = new SchemeBuiltinFunction('+', 'test');

    it('should only have `isSchemeObject` and `isSchemeBuiltinFunction` set to true', function () {
        expect(schemeBuiltinFunction.isSchemeObject).to.be.true;
        expect(schemeBuiltinFunction.isSchemeAtom).to.be.false;
        expect(schemeBuiltinFunction.isSchemeNil).to.be.false;
        expect(schemeBuiltinFunction.isSchemeVoid).to.be.false;
        expect(schemeBuiltinFunction.isSchemeTrue).to.be.false;
        expect(schemeBuiltinFunction.isSchemeFalse).to.be.false;
        expect(schemeBuiltinFunction.isSchemeNumber).to.be.false;
        expect(schemeBuiltinFunction.isSchemeString).to.be.false;
        expect(schemeBuiltinFunction.isSchemeSymbol).to.be.false;
        expect(schemeBuiltinFunction.isSchemeCons).to.be.false;
        expect(schemeBuiltinFunction.isSchemeEnvironment).to.be.false;
        expect(schemeBuiltinFunction.isSchemeBuiltinFunction).to.be.true;
        expect(schemeBuiltinFunction.isSchemeUserDefinedFunction).to.be.false;
    });


    it('should have an `symbol` property', function () {
        expect(schemeBuiltinFunction).to.have.a.property('symbol');
        expect(schemeBuiltinFunction.symbol).to.be.an('object');
        expect(schemeBuiltinFunction.symbol.equals(new SchemeSymbol('+'))).to.be.true;
    });

    it('should have an `operation` property', function () {
        expect(schemeBuiltinFunction).to.have.a.property('operation');
        expect(schemeBuiltinFunction.operation).to.equal('test');
    });

    it('should have a `toString` function / be printable', function () {
        expect(schemeBuiltinFunction).to.have.a.property('toString');
        expect(schemeBuiltinFunction.toString).to.be.a('function');
        expect(schemeBuiltinFunction.toString()).to.equal('<builtin-function:+>');
    });
});
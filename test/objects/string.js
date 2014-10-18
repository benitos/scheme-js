/**
 * Tests für SchemeObject
 */

var chai = require('chai'),
    expect = chai.expect;

var SchemeString = require('../../src/objects/string'),
    SchemeTrue = require('../../src/objects/true');

describe('SchemeString', function () {
    var schemeString = new SchemeString();

    it('should only have `isSchemeObject`, `isSchemeAtom` and `isSchemeString` set to true', function () {
        expect(schemeString.isSchemeObject).to.be.true;
        expect(schemeString.isSchemeAtom).to.be.true;
        expect(schemeString.isSchemeNil).to.be.false;
        expect(schemeString.isSchemeVoid).to.be.false;
        expect(schemeString.isSchemeTrue).to.be.false;
        expect(schemeString.isSchemeFalse).to.be.false;
        expect(schemeString.isSchemeNumber).to.be.false;
        expect(schemeString.isSchemeString).to.be.true;
        expect(schemeString.isSchemeSymbol).to.be.false;
        expect(schemeString.isSchemeCons).to.be.false;
        expect(schemeString.isSchemeEnvironment).to.be.false;
        expect(schemeString.isSchemeBuiltinFunction).to.be.false;
        expect(schemeString.isSchemeUserDefinedFunction).to.be.false;
    });

    it('should have a (mutable) `characters` property', function () {
        expect(schemeString).to.have.a.property('characters');
        expect(schemeString.characters).to.equal('');
        schemeString.characters = 'hello world';
        expect(schemeString.characters).to.equal('hello world');
    });

    it('should have an `equals` function', function () {
        expect(schemeString).to.have.a.property('equals');
        expect(schemeString.equals).to.be.a('function');
        expect(schemeString.equals(schemeString)).to.be.true;
        schemeString.characters = 'test';
        expect(schemeString.equals(new SchemeString('test'))).to.be.true;
        expect(schemeString.equals(new SchemeString('nope'))).to.be.false;
        expect(schemeString.equals(new SchemeTrue())).to.be.false;
    });

    it('should have a `toString` function / be printable', function () {
        expect(schemeString).to.have.a.property('toString');
        schemeString.characters = 'hello world';
        expect(schemeString.toString).to.be.a('function');
        expect(schemeString.toString()).to.equal('"hello world"');
    });
});
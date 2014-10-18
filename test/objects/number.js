/**
 * Tests für SchemeObject
 */

var chai = require('chai'),
    expect = chai.expect;

var SchemeNumber = require('../../src/objects/number'),
    SchemeTrue = require('../../src/objects/true');

describe('SchemeNumber', function () {
    var schemeNumber = new SchemeNumber();

    it('should only have `isSchemeObject`, `isSchemeAtom` and `isSchemeNumber` set to true', function () {
        expect(schemeNumber.isSchemeObject).to.be.true;
        expect(schemeNumber.isSchemeAtom).to.be.true;
        expect(schemeNumber.isSchemeNil).to.be.false;
        expect(schemeNumber.isSchemeVoid).to.be.false;
        expect(schemeNumber.isSchemeTrue).to.be.false;
        expect(schemeNumber.isSchemeFalse).to.be.false;
        expect(schemeNumber.isSchemeNumber).to.be.true;
        expect(schemeNumber.isSchemeString).to.be.false;
        expect(schemeNumber.isSchemeSymbol).to.be.false;
        expect(schemeNumber.isSchemeCons).to.be.false;
        expect(schemeNumber.isSchemeEnvironment).to.be.false;
        expect(schemeNumber.isSchemeBuiltinFunction).to.be.false;
        expect(schemeNumber.isSchemeUserDefinedFunction).to.be.false;
    });

    it('should have a (mutable) `value` property', function () {
        expect(schemeNumber).to.have.a.property('value');
        expect(schemeNumber.value).to.equal(0);
        schemeNumber.value = 1;
        expect(schemeNumber.value).to.equal(1);
    });

    it('should have an `equals` function', function () {
        expect(schemeNumber).to.have.a.property('equals');
        expect(schemeNumber.equals).to.be.a('function');
        expect(schemeNumber.equals(schemeNumber)).to.be.true;
        schemeNumber.value = 2;
        expect(schemeNumber.equals(new SchemeNumber(2))).to.be.true;
        expect(schemeNumber.equals(new SchemeNumber(3))).to.be.false;
        expect(schemeNumber.equals(new SchemeTrue())).to.be.false;
    });

    it('should have a `toString` function / be printable', function () {
        expect(schemeNumber).to.have.a.property('toString');
        schemeNumber.value = 2;
        expect(schemeNumber.toString).to.be.a('function');
        expect(schemeNumber.toString()).to.equal(2);
    });
});
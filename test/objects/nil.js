/**
 * Tests für SchemeObject
 */

var chai = require('chai'),
    expect = chai.expect;

var SchemeNil = require('../../src/objects/nil'),
    SchemeTrue = require('../../src/objects/true');

describe('SchemeNil', function () {
    var schemeNil = new SchemeNil();

    it('should only have `isSchemeObject`, `isSchemeAtom` and `isSchemeNil` set to true', function () {
        expect(schemeNil.isSchemeObject).to.be.true;
        expect(schemeNil.isSchemeAtom).to.be.true;
        expect(schemeNil.isSchemeNil).to.be.true;
        expect(schemeNil.isSchemeVoid).to.be.false;
        expect(schemeNil.isSchemeTrue).to.be.false;
        expect(schemeNil.isSchemeFalse).to.be.false;
        expect(schemeNil.isSchemeNumber).to.be.false;
        expect(schemeNil.isSchemeString).to.be.false;
        expect(schemeNil.isSchemeSymbol).to.be.false;
        expect(schemeNil.isSchemeCons).to.be.false;
        expect(schemeNil.isSchemeEnvironment).to.be.false;
        expect(schemeNil.isSchemeBuiltinFunction).to.be.false;
        expect(schemeNil.isSchemeUserDefinedFunction).to.be.false;
    });

    it('should have an `equals` function', function () {
        expect(schemeNil).to.have.a.property('equals');
        expect(schemeNil.equals).to.be.a('function');
        expect(schemeNil.equals(schemeNil)).to.be.true;
        expect(schemeNil.equals(new SchemeNil())).to.be.true;
        expect(schemeNil.equals(new SchemeTrue())).to.be.false;
    });

    it('should have a `toString` function / be printable', function () {
        expect(schemeNil).to.have.a.property('toString');
        expect(schemeNil.toString).to.be.a('function');
        expect(schemeNil.toString()).to.equal('nil');
    });

    it('should be a singleton', function () {
        var dummy = new SchemeNil();
        expect(schemeNil).to.have.a.property('_instance');
        expect(schemeNil._instance).to.be.a('object');
        expect(schemeNil._instance).to.deep.equal(dummy._instance);
        expect(schemeNil).to.equal(dummy);
    });
});
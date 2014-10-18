/**
 * Tests für SchemeObject
 */

var chai = require('chai'),
    expect = chai.expect;

var SchemeTrue = require('../../src/objects/true'),
    SchemeFalse = require('../../src/objects/false');

describe('SchemeTrue', function () {
    var schemeTrue = new SchemeTrue();

    it('should only have `isSchemeObject`, `isSchemeAtom` and `isSchemeTrue` set to true', function () {
        expect(schemeTrue.isSchemeObject).to.be.true;
        expect(schemeTrue.isSchemeAtom).to.be.true;
        expect(schemeTrue.isSchemeNil).to.be.false;
        expect(schemeTrue.isSchemeVoid).to.be.false;
        expect(schemeTrue.isSchemeTrue).to.be.true;
        expect(schemeTrue.isSchemeFalse).to.be.false;
        expect(schemeTrue.isSchemeNumber).to.be.false;
        expect(schemeTrue.isSchemeString).to.be.false;
        expect(schemeTrue.isSchemeSymbol).to.be.false;
        expect(schemeTrue.isSchemeCons).to.be.false;
        expect(schemeTrue.isSchemeEnvironment).to.be.false;
        expect(schemeTrue.isSchemeBuiltinFunction).to.be.false;
        expect(schemeTrue.isSchemeUserDefinedFunction).to.be.false;
    });

    it('should have an `equals` function', function () {
        expect(schemeTrue).to.have.a.property('equals');
        expect(schemeTrue.equals).to.be.a('function');
        expect(schemeTrue.equals(schemeTrue)).to.be.true;
        expect(schemeTrue.equals(new SchemeTrue())).to.be.true;
        expect(schemeTrue.equals(new SchemeFalse())).to.be.false;
    });

    it('should have a `toString` function / be printable', function () {
        expect(schemeTrue).to.have.a.property('toString');
        expect(schemeTrue.toString).to.be.a('function');
        expect(schemeTrue.toString()).to.equal('#true');
    });

    it('should be a singleton', function () {
        var dummy = new SchemeTrue();
        expect(schemeTrue).to.have.a.property('_instance');
        expect(schemeTrue._instance).to.be.a('object');
        expect(schemeTrue._instance).to.deep.equal(dummy._instance);
        expect(schemeTrue).to.equal(dummy);
    });
});
/**
 * Tests für SchemeObject
 */

var chai = require('chai'),
    expect = chai.expect;

var SchemeObject = require('../../src/objects/object');

describe('SchemeObject', function () {
    var schemeObject = new SchemeObject();

    it('should only have `isSchemeObject` set to true', function () {
        expect(schemeObject.isSchemeObject).to.be.true;
        expect(schemeObject.isSchemeAtom).to.be.false;
        expect(schemeObject.isSchemeNil).to.be.false;
        expect(schemeObject.isSchemeVoid).to.be.false;
        expect(schemeObject.isSchemeTrue).to.be.false;
        expect(schemeObject.isSchemeFalse).to.be.false;
        expect(schemeObject.isSchemeNumber).to.be.false;
        expect(schemeObject.isSchemeString).to.be.false;
        expect(schemeObject.isSchemeSymbol).to.be.false;
        expect(schemeObject.isSchemeCons).to.be.false;
        expect(schemeObject.isSchemeEnvironment).to.be.false;
        expect(schemeObject.isSchemeBuiltinFunction).to.be.false;
        expect(schemeObject.isSchemeUserDefinedFunction).to.be.false;
    });

    it('should have an `equals` function', function () {
        expect(schemeObject).to.have.a.property('equals');
        expect(schemeObject.equals).to.be.a('function');
        expect(schemeObject.equals(schemeObject)).to.be.true;
        expect(schemeObject.equals(new SchemeObject())).to.be.false;
    });

    it('should have an `toString` function', function () {
        expect(schemeObject).to.have.a.property('toString');
        expect(schemeObject.toString).to.be.a('function');
        expect(schemeObject.toString()).to.equal('SchemeObject');
    });

    it('should have an `getType` function', function () {
        expect(schemeObject).to.have.a.property('getType');
        expect(schemeObject.getType).to.be.a('function');
        expect(schemeObject.getType()).to.equal('SchemeObject');
    });
});
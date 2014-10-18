/**
 * Tests für SchemeObject
 */

var chai = require('chai'),
    expect = chai.expect;

var SchemeVoid = require('../../src/objects/void'),
    SchemeTrue = require('../../src/objects/true');

describe('SchemeVoid', function () {
    var schemeVoid = new SchemeVoid();

    it('should only have `isSchemeObject` and `isSchemeVoid` set to true', function () {
        expect(schemeVoid.isSchemeObject).to.be.true;
        expect(schemeVoid.isSchemeAtom).to.be.false;
        expect(schemeVoid.isSchemeNil).to.be.false;
        expect(schemeVoid.isSchemeVoid).to.be.true;
        expect(schemeVoid.isSchemeTrue).to.be.false;
        expect(schemeVoid.isSchemeFalse).to.be.false;
        expect(schemeVoid.isSchemeNumber).to.be.false;
        expect(schemeVoid.isSchemeString).to.be.false;
        expect(schemeVoid.isSchemeSymbol).to.be.false;
        expect(schemeVoid.isSchemeCons).to.be.false;
        expect(schemeVoid.isSchemeEnvironment).to.be.false;
        expect(schemeVoid.isSchemeBuiltinFunction).to.be.false;
        expect(schemeVoid.isSchemeUserDefinedFunction).to.be.false;
    });

    it('should have an `equals` function', function () {
        expect(schemeVoid).to.have.a.property('equals');
        expect(schemeVoid.equals).to.be.a('function');
        expect(schemeVoid.equals(schemeVoid)).to.be.true;
        expect(schemeVoid.equals(new SchemeVoid())).to.be.true;
        expect(schemeVoid.equals(new SchemeTrue())).to.be.false;
    });

    it('should have a `toString` function / be printable', function () {
        expect(schemeVoid).to.have.a.property('toString');
        expect(schemeVoid.toString).to.be.a('function');
        expect(schemeVoid.toString()).to.equal('');
    });
});
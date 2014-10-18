/**
 * Tests für SchemeObject
 */

var chai = require('chai'),
    expect = chai.expect;

var SchemeAtom = require('../../src/objects/atom');

describe('SchemeAtom', function () {
    var schemeAtom = new SchemeAtom();

    it('should only have `isSchemeObject` and `isSchemeAtom` set to true', function () {
        expect(schemeAtom.isSchemeObject).to.be.true;
        expect(schemeAtom.isSchemeAtom).to.be.true;
        expect(schemeAtom.isSchemeNil).to.be.false;
        expect(schemeAtom.isSchemeVoid).to.be.false;
        expect(schemeAtom.isSchemeTrue).to.be.false;
        expect(schemeAtom.isSchemeFalse).to.be.false;
        expect(schemeAtom.isSchemeNumber).to.be.false;
        expect(schemeAtom.isSchemeString).to.be.false;
        expect(schemeAtom.isSchemeSymbol).to.be.false;
        expect(schemeAtom.isSchemeCons).to.be.false;
        expect(schemeAtom.isSchemeEnvironment).to.be.false;
        expect(schemeAtom.isSchemeBuiltinFunction).to.be.false;
        expect(schemeAtom.isSchemeUserDefinedFunction).to.be.false;
    });

    it('should have an `equals` function', function () {
        expect(schemeAtom).to.have.a.property('equals');
        expect(schemeAtom.equals).to.be.a('function');
        expect(schemeAtom.equals(schemeAtom)).to.be.true;
        expect(schemeAtom.equals(new SchemeAtom())).to.be.false;
    });
});
/**
 * Tests für SchemeObject
 */

var chai = require('chai'),
    expect = chai.expect;

var SchemeFalse = require('../../src/objects/false'),
    SchemeTrue = require('../../src/objects/true');

describe('SchemeFalse', function () {
    var schemeFalse = new SchemeFalse();

    it('should only have `isSchemeObject`, `isSchemeAtom` and `isSchemeFalse` set to true', function () {
        expect(schemeFalse.isSchemeObject).to.be.true;
        expect(schemeFalse.isSchemeAtom).to.be.true;
        expect(schemeFalse.isSchemeNil).to.be.false;
        expect(schemeFalse.isSchemeVoid).to.be.false;
        expect(schemeFalse.isSchemeTrue).to.be.false;
        expect(schemeFalse.isSchemeFalse).to.be.true;
        expect(schemeFalse.isSchemeNumber).to.be.false;
        expect(schemeFalse.isSchemeString).to.be.false;
        expect(schemeFalse.isSchemeSymbol).to.be.false;
        expect(schemeFalse.isSchemeCons).to.be.false;
        expect(schemeFalse.isSchemeEnvironment).to.be.false;
        expect(schemeFalse.isSchemeBuiltinFunction).to.be.false;
        expect(schemeFalse.isSchemeUserDefinedFunction).to.be.false;
    });

    it('should have an `equals` function', function () {
        expect(schemeFalse).to.have.a.property('equals');
        expect(schemeFalse.equals).to.be.a('function');
        expect(schemeFalse.equals(schemeFalse)).to.be.true;
        expect(schemeFalse.equals(new SchemeFalse())).to.be.true;
        expect(schemeFalse.equals(new SchemeTrue())).to.be.false;
    });

    it('should have a `toString` function / be printable', function () {
        expect(schemeFalse).to.have.a.property('toString');
        expect(schemeFalse.toString).to.be.a('function');
        expect(schemeFalse.toString()).to.equal('#false');
    });

    it('should be a singleton', function () {
        var dummy = new SchemeFalse();
        expect(schemeFalse).to.have.a.property('_instance');
        expect(schemeFalse._instance).to.be.a('object');
        expect(schemeFalse._instance).to.deep.equal(dummy._instance);
        expect(schemeFalse).to.equal(dummy);
    });
});
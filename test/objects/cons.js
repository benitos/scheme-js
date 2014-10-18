/**
 * Tests für SchemeObject
 */

var chai = require('chai'),
    expect = chai.expect;

var SchemeCons = require('../../src/objects/cons'),
    SchemeNil  = require('../../src/objects/nil'),
    SchemeTrue  = require('../../src/objects/true');

describe('SchemeCons', function () {
    var schemeCons = new SchemeCons(new SchemeNil(), new SchemeNil());

    it('should only have `isSchemeObject` and `isSchemeCons` set to true', function () {
        expect(schemeCons.isSchemeObject).to.be.true;
        expect(schemeCons.isSchemeAtom).to.be.false;
        expect(schemeCons.isSchemeNil).to.be.false;
        expect(schemeCons.isSchemeVoid).to.be.false;
        expect(schemeCons.isSchemeTrue).to.be.false;
        expect(schemeCons.isSchemeFalse).to.be.false;
        expect(schemeCons.isSchemeNumber).to.be.false;
        expect(schemeCons.isSchemeString).to.be.false;
        expect(schemeCons.isSchemeSymbol).to.be.false;
        expect(schemeCons.isSchemeCons).to.be.true;
        expect(schemeCons.isSchemeEnvironment).to.be.false;
        expect(schemeCons.isSchemeBuiltinFunction).to.be.false;
        expect(schemeCons.isSchemeUserDefinedFunction).to.be.false;
    });

    it('should have an `equals` function', function () {
        expect(schemeCons).to.have.a.property('equals');
        expect(schemeCons.equals).to.be.a('function');
        expect(schemeCons.equals(schemeCons)).to.be.true;
        expect(schemeCons.equals(new SchemeCons(new SchemeNil(), new SchemeNil()))).to.be.true;
        expect(schemeCons.equals(new SchemeCons(new SchemeNil(), new SchemeTrue()))).to.be.false;
        expect(schemeCons.equals(new SchemeCons(new SchemeTrue(), new SchemeNil()))).to.be.false;
        expect(schemeCons.equals(new SchemeCons(new SchemeTrue(), new SchemeTrue()))).to.be.false;
    });

    it('should have a `toString` function / be printable', function () {
        expect(schemeCons).to.have.a.property('toString');
        expect(schemeCons.toString).to.be.a('function');
        expect(schemeCons.toString()).to.equal('()');
    });

    it('should have a `second` function', function () {
        expect(schemeCons).to.have.a.property('second');
        expect(schemeCons.second).to.be.a('function');
    });

    describe('.second()', function () {
        it('should return `SchemeNil` if there is no `cdr` or `cdr` is not a `cons`', function () {
            expect(schemeCons.second()).to.deep.equal(new SchemeNil());
        });

        it('should return the `cdr`->`car`', function () {
            var contentCons = new SchemeCons('2', '3'),
                testCons = new SchemeCons('1', contentCons);
            expect(testCons.second()).to.deep.equal(contentCons.car);
        });
    });
});
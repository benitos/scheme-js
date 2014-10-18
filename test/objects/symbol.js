/**
 * Tests für SchemeObject
 */

var chai = require('chai'),
    expect = chai.expect;

var SchemeSymbol = require('../../src/objects/symbol'),
    SchemeTrue = require('../../src/objects/true');

describe('SchemeSymbol', function () {
    var schemeSymbol = new SchemeSymbol();

    it('should only have `isSchemeObject` and `isSchemeSymbol` set to true', function () {
        expect(schemeSymbol.isSchemeObject).to.be.true;
        expect(schemeSymbol.isSchemeAtom).to.be.true;
        expect(schemeSymbol.isSchemeNil).to.be.false;
        expect(schemeSymbol.isSchemeVoid).to.be.false;
        expect(schemeSymbol.isSchemeTrue).to.be.false;
        expect(schemeSymbol.isSchemeFalse).to.be.false;
        expect(schemeSymbol.isSchemeNumber).to.be.false;
        expect(schemeSymbol.isSchemeString).to.be.false;
        expect(schemeSymbol.isSchemeSymbol).to.be.true;
        expect(schemeSymbol.isSchemeCons).to.be.false;
        expect(schemeSymbol.isSchemeEnvironment).to.be.false;
        expect(schemeSymbol.isSchemeBuiltinFunction).to.be.false;
        expect(schemeSymbol.isSchemeUserDefinedFunction).to.be.false;
    });

    it('should have a (mutable) `characters` property', function () {
        expect(schemeSymbol).to.have.a.property('characters');
        expect(schemeSymbol.characters).to.equal('');
        schemeSymbol.characters = 'hello world';
        expect(schemeSymbol.characters).to.equal('hello world');
    });

    it('should have a `toString` function / be printable', function () {
        expect(schemeSymbol).to.have.a.property('toString');
        schemeSymbol.characters = 'hello world';
        expect(schemeSymbol.toString).to.be.a('function');
        expect(schemeSymbol.toString()).to.equal('<hello world>');
    });

    it('should have an `equals` function / be comparable', function () {
        expect(schemeSymbol).to.have.a.property('equals');
        expect(schemeSymbol.equals).to.be.a('function');
    });

    describe('.equals()', function () {
        var equalSymbol = new SchemeSymbol('test'),
            differentSymbol = new SchemeSymbol('different');

        it('should return true if two symbols are equal', function () {
            schemeSymbol.characters = 'test';

            expect(schemeSymbol.equals(equalSymbol)).to.be.true;
        });

        it('should return false if two symbols are not equal', function () {
            expect(schemeSymbol.equals(differentSymbol)).to.be.false;
        });

        it('should return false if the parameter is not a symbol', function () {
            expect(schemeSymbol.equals(new SchemeTrue())).to.be.false;
        });

    });
});
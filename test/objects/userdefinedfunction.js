/**
 * Tests für SchemeObject
 */

var chai = require('chai'),
    expect = chai.expect;

var SchemeUserDefinedFunction = require('../../src/objects/userdefinedfunction'),
    SchemeCons = require('../../src/objects/cons'),
    SchemeSymbol = require('../../src/objects/symbol');

describe('SchemeUserDefinedFunction', function () {
    var schemeUserDefinedFunction = new SchemeUserDefinedFunction();

    it('should only have `isSchemeObject` and `isSchemeUserDefinedFunction` set to true', function () {
        expect(schemeUserDefinedFunction.isSchemeObject).to.be.true;
        expect(schemeUserDefinedFunction.isSchemeAtom).to.be.false;
        expect(schemeUserDefinedFunction.isSchemeNil).to.be.false;
        expect(schemeUserDefinedFunction.isSchemeVoid).to.be.false;
        expect(schemeUserDefinedFunction.isSchemeTrue).to.be.false;
        expect(schemeUserDefinedFunction.isSchemeFalse).to.be.false;
        expect(schemeUserDefinedFunction.isSchemeNumber).to.be.false;
        expect(schemeUserDefinedFunction.isSchemeString).to.be.false;
        expect(schemeUserDefinedFunction.isSchemeSymbol).to.be.false;
        expect(schemeUserDefinedFunction.isSchemeCons).to.be.false;
        expect(schemeUserDefinedFunction.isSchemeEnvironment).to.be.false;
        expect(schemeUserDefinedFunction.isSchemeBuiltinFunction).to.be.false;
        expect(schemeUserDefinedFunction.isSchemeUserDefinedFunction).to.be.true;
    });
    
    it('should have a `toString` function / be printable', function () {
        expect(schemeUserDefinedFunction).to.have.a.property('toString');
        expect(schemeUserDefinedFunction.toString).to.be.a('function');
        expect(schemeUserDefinedFunction.toString()).to.equal('<user-defined-function>');
    });

    it('should have `args`, `bodyList` and `environment` properties', function () {
        var args = [1,2,3],
            bodyList = new SchemeCons(),
            env = { just: 'to Test' },
            testFn = new SchemeUserDefinedFunction(args, bodyList, env);
        
        expect(testFn).to.have.a.property('args');
        expect(testFn).to.have.a.property('bodyList');
        expect(testFn).to.have.a.property('environment');

        expect(testFn.args).to.deep.equal(args);
        expect(testFn.bodyList).to.deep.equal(new SchemeCons(new SchemeSymbol('begin'), bodyList));
        expect(testFn.environment).to.deep.equal(env);
    });
});
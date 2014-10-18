/**
 * Tests für SchemeEnvironment
 */

var chai = require('chai'),
    expect = chai.expect;

var SchemeEnvironment = require('../../src/objects/environment'),
    SchemeSymbol = require('../../src/objects/symbol');

describe('SchemeEnvironment', function () {
    var schemeEnvironment = new SchemeEnvironment();

    it('should only have `isSchemeObject` and `isSchemeEnvironment` set to true', function () {
        expect(schemeEnvironment.isSchemeObject).to.be.true;
        expect(schemeEnvironment.isSchemeAtom).to.be.false;
        expect(schemeEnvironment.isSchemeNil).to.be.false;
        expect(schemeEnvironment.isSchemeVoid).to.be.false;
        expect(schemeEnvironment.isSchemeTrue).to.be.false;
        expect(schemeEnvironment.isSchemeFalse).to.be.false;
        expect(schemeEnvironment.isSchemeNumber).to.be.false;
        expect(schemeEnvironment.isSchemeString).to.be.false;
        expect(schemeEnvironment.isSchemeSymbol).to.be.false;
        expect(schemeEnvironment.isSchemeCons).to.be.false;
        expect(schemeEnvironment.isSchemeEnvironment).to.be.true;
        expect(schemeEnvironment.isSchemeBuiltinFunction).to.be.false;
        expect(schemeEnvironment.isSchemeUserDefinedFunction).to.be.false;
    });

    it('should have a `localBindings` property', function () {
        expect(schemeEnvironment).to.have.a.property('localBindings');
    });

    it('should have a `parentEnvironment` property', function () {
        expect(schemeEnvironment).to.have.a.property('parentEnvironment');
    });
    
    it('should have a `toString` function / be printable', function () {
        expect(schemeEnvironment).to.have.a.property('toString');
        expect(schemeEnvironment.toString).to.be.a('function');
        expect(schemeEnvironment.toString()).to.equal('Bindings:  \nParent: none');
    });

    it('should have a `addBindingFor` function', function () {
        expect(schemeEnvironment).to.have.a.property('addBindingFor');
        expect(schemeEnvironment.toString).to.be.a('function');
    });

    it('should have a `getBindingFor` function', function () {
        expect(schemeEnvironment).to.have.a.property('getBindingFor');
        expect(schemeEnvironment.toString).to.be.a('function');
    });

    it('should have a `changeBindingFor` function', function () {
        expect(schemeEnvironment).to.have.a.property('changeBindingFor');
        expect(schemeEnvironment.toString).to.be.a('function');
    });

    describe('.addBindingFor()', function () {
        it('should add a new binding for a given (new) symbol', function () {
            var symbol = new SchemeSymbol('test');
            expect(Object.keys(schemeEnvironment.localBindings)).to.have.length(0);
            schemeEnvironment.addBindingFor(symbol, 'geht');
            expect(Object.keys(schemeEnvironment.localBindings)).to.have.length(1);
            expect(schemeEnvironment.localBindings).to.be.have.a.property(symbol.toString());
            expect(schemeEnvironment.localBindings[symbol.toString()].key).to.deep.equal(symbol);
            expect(schemeEnvironment.localBindings[symbol.toString()].value).to.equal('geht');
        });

        it('should throw an error, if no symbol is used for a binding', function () {
            expect(schemeEnvironment.addBindingFor.bind(schemeEnvironment, 'test', 'geht ned')).to.throw('addBindingFor: expected a `SchemeSymbol` but got something else (string)!');
        });

        it('should throw an error, if a binding for a given symbol already exists', function () {
            var symbol = new SchemeSymbol('error'),
                symbol2 = new SchemeSymbol('error'),
                length = (Object.keys(schemeEnvironment.localBindings)).length;
            
            schemeEnvironment.addBindingFor(symbol, 'geht');
            expect(Object.keys(schemeEnvironment.localBindings)).to.have.length(length + 1);
            expect(schemeEnvironment.localBindings).to.be.have.a.property(symbol.toString());
            expect(schemeEnvironment.localBindings[symbol.toString()].key).to.deep.equal(symbol);
            expect(schemeEnvironment.localBindings[symbol.toString()].value).to.equal('geht');
            expect(schemeEnvironment.addBindingFor.bind(schemeEnvironment, symbol2, 'geht')).to.throw('addBindingFor: binding for "' + symbol2.toString() + '" already exists!');
        });
    });

    describe('.getBindingFor()', function () {
        it('should return the stored value for a given symbol', function () {
            var symbol = new SchemeSymbol('testGetBindingFor');

            schemeEnvironment.addBindingFor(symbol, 'laeuft');
            expect(schemeEnvironment.getBindingFor(symbol)).to.equal('laeuft');
        });

        it('should throw an error, if no symbol is used for a binding', function () {
            expect(schemeEnvironment.getBindingFor.bind(schemeEnvironment, 'test')).to.throw('getBindingFor: expected a `SchemeSymbol` but got something else (string)!');
        });
    });

    describe('.changeBindingFor()', function () {
        it('should change an existing binding for a given symbol', function () {
            var symbol = new SchemeSymbol('testChangeBindingFor');

            schemeEnvironment.addBindingFor(symbol, 'v1');
            expect(schemeEnvironment.getBindingFor(symbol)).to.equal('v1');
            schemeEnvironment.changeBindingFor(symbol, 'v2');
            expect(schemeEnvironment.getBindingFor(symbol)).to.equal('v2');
        });

        it('should throw an error, if no symbol is used for a binding', function () {
            expect(schemeEnvironment.changeBindingFor.bind(schemeEnvironment, 'test', 'geht ned')).to.throw('changeBindingFor: expected a `SchemeSymbol` but got something else (string)!');
        });
    });
});
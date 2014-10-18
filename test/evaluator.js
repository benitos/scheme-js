/**
 * Tests für den Reader
 */

var chai = require('chai'),
    expect = chai.expect;

var SchemeEvaluator = require('../src/evaluator');
var SchemeObject = require('../src/objects/object');
var SchemeString = require('../src/objects/string');
var SchemeNumber = require('../src/objects/number');
var SchemeSymbol = require('../src/objects/symbol');
var SchemeNil    = require('../src/objects/nil');
var SchemeTrue   = require('../src/objects/true');
var SchemeFalse  = require('../src/objects/false');
var SchemeCons   = require('../src/objects/cons');
var SchemeBuiltinFunction      = require('../src/objects/builtinfunction');
var SchemeUserDefinedFunction  = require('../src/objects/userdefinedfunction');


describe('SchemeEvaluator', function () {
    var evaluator = new SchemeEvaluator(),
        environment = evaluator.environment;

    it('should have an `environment` property', function () {
        expect(evaluator).to.have.a.property('environment');
        expect(evaluator.environment).not.to.be.null;
        expect(evaluator.environment.localBindings).to.be.an('object');
        expect(evaluator.environment.localBindings['<+>']).to.be.an('object');
    });

    it('should have an `eval` function', function () {
        expect(evaluator).to.have.a.property('eval');
        expect(evaluator.eval).to.be.a('function');

        
        describe('.eval()', function () {
            it('should eval a builtin function', function () {
                expect(evaluator.eval(new SchemeSymbol('define'))).to.deep.equal(environment.localBindings['<define>'].value);
                expect(
                    evaluator.eval(
                        new SchemeCons(
                            new SchemeSymbol('define'),
                            new SchemeCons(
                                new SchemeSymbol('a'),
                                new SchemeCons(
                                    new SchemeNumber(10),
                                    new SchemeNil()
                                )
                            )
                        ),
                        environment
                    )
                ).to.deep.equal(new SchemeNumber(10));
            });

            it('should eval a cons', function () {
                expect(
                    evaluator.eval(
                        new SchemeCons(
                            new SchemeSymbol('cons'),
                            new SchemeCons(
                                new SchemeNumber(5),
                                new SchemeCons(
                                    new SchemeNumber(10),
                                    new SchemeNil()
                                )
                            )
                        )
                    )
                ).to.deep.equal(new SchemeCons(new SchemeNumber(5), new SchemeNumber(10)));
            });

            // Wird inzwischen vom Reader gemacht
            // it('should eval a false', function () {
            //     expect(evaluator.eval(new SchemeSymbol('false'))).to.deep.equal(new SchemeFalse());
            //     expect(evaluator.eval(new SchemeSymbol('#f'))).to.deep.equal(new SchemeFalse());
            // });
            // 
            // it('should eval a true', function () {
            //     expect(evaluator.eval(new SchemeSymbol('true'))).to.deep.equal(new SchemeTrue());
            //     expect(evaluator.eval(new SchemeSymbol('#t'))).to.deep.equal(new SchemeTrue());
            // });
            //
            // it('should eval a nil', function () {
            //     expect(evaluator.eval(new SchemeSymbol('nil'))).to.deep.equal(new SchemeNil());
            // });

            it('should (not) eval atoms', function () {
                var num = new SchemeNumber(10),
                    str = new SchemeString('test'),
                    tru = new SchemeTrue(),
                    fal = new SchemeFalse(),
                    nil = new SchemeNil(),
                    sym = new SchemeSymbol('test');
                expect(evaluator.eval(num)).to.deep.equal(num);
                expect(evaluator.eval(str)).to.deep.equal(str);
                expect(evaluator.eval(tru)).to.deep.equal(tru);
                expect(evaluator.eval(fal)).to.deep.equal(fal);
                expect(evaluator.eval(nil)).to.deep.equal(nil);

                // Symbole schon
                evaluator.environment.addBindingFor(sym, num);
                expect(evaluator.eval(sym)).to.deep.equal(num);
            });

            it('should eval a userdefined function', function () {
                var symb = new SchemeSymbol('add2'),
                    args = new SchemeCons(new SchemeSymbol('x'), new SchemeNil()),
                    body = new SchemeCons(new SchemeCons(new SchemeSymbol('+'), new SchemeCons(new SchemeSymbol('x'), new SchemeCons(new SchemeNumber(2), new SchemeNil()))), new SchemeNil());

                evaluator.environment.addBindingFor(symb, new SchemeUserDefinedFunction(args, body, evaluator.environment));

                expect(evaluator.eval(symb)).to.deep.equal(evaluator.environment.getBindingFor(symb));
                expect(evaluator.eval(new SchemeCons(symb, new SchemeCons(new SchemeNumber(3), new SchemeNil())))).to.deep.equal(new SchemeNumber(5));
            });

            it('should return the schemeObject if it\'s not a SchemeAtom/SchemeCons', function () {
                var obj = new SchemeObject();

                expect(evaluator.eval(obj)).to.deep.equal(obj);
            });

            it('should throw an error if the argument isn\'t a SchemeObject', function () {
                expect(evaluator.eval).to.throw('(eval): expected a SchemeObject but got a `undefined`!');
            });
        });
    });

    it('should have an `evalCons` function', function () {
        expect(evaluator).to.have.a.property('evalCons');
        expect(evaluator.evalCons).to.be.a('function');

        describe('.evalCons()', function () {
            it('should throw an error, if the argument isn\'t a cons', function () {
                expect(evaluator.evalCons).to.throw('(evalCons): expected a SchemeCons but got a `undefined`!');
                expect(evaluator.evalCons.bind(evaluator, true)).to.throw('(evalCons): expected a SchemeCons but got a `boolean`!');
            });

            it('should throw an error, if there is no function in function slot', function () {
                expect(evaluator.evalCons.bind(evaluator, new SchemeCons(new SchemeString('pumuckel'), new SchemeNil()))).to.throw('(evalCons): non function in function slot: `"pumuckel"`!');
            });

            it('should eval builtin functions', function () {
                expect(evaluator.evalCons(new SchemeCons(new SchemeSymbol('+'), new SchemeCons(new SchemeNumber(2), new SchemeCons( new SchemeNumber(3), new SchemeNil()))))).to.deep.equal(new SchemeNumber(5));
            });

            it('should eval userdefined functions', function () {
                var symb = new SchemeSymbol('add3'),
                    args = new SchemeCons(new SchemeSymbol('x'), new SchemeNil()),
                    body = new SchemeCons(new SchemeCons(new SchemeSymbol('+'), new SchemeCons(new SchemeSymbol('x'), new SchemeCons(new SchemeNumber(3), new SchemeNil()))), new SchemeNil());

                evaluator.environment.addBindingFor(symb, new SchemeUserDefinedFunction(args, body, evaluator.environment));
                expect(evaluator.evalCons(new SchemeCons(symb, new SchemeCons(new SchemeNumber(3), new SchemeNil())))).to.deep.equal(new SchemeNumber(6));
            });
        });
    });

    it('should have an `evalBuiltinFunction` function', function () {
        expect(evaluator).to.have.a.property('evalBuiltinFunction');
        expect(evaluator.evalBuiltinFunction).to.be.a('function');

        describe('.evalBuiltinFunction()', function () {
            it('should throw an error, if there is no argument', function () {
                expect(evaluator.evalBuiltinFunction).to.throw('(evalBuiltinFunction): expected an argument but got a `undefined`!');
                expect(evaluator.evalBuiltinFunction.bind(evaluator, evaluator.environment.getBindingFor(new SchemeSymbol('+')), false)).to.throw('(evalBuiltinFunction): expected an argument but got a `boolean`!');
            });

            it('should eval builtin functions', function () {
                expect(evaluator.evalBuiltinFunction(evaluator.environment.getBindingFor(new SchemeSymbol('+')), new SchemeCons(new SchemeNumber(2), new SchemeCons(new SchemeNumber(3), new SchemeNil())), evaluator.environment)).to.deep.equal(new SchemeNumber(5));
            });
        });
    });

    it('should have an `evalUserDefinedFunction` function', function () {
        expect(evaluator).to.have.a.property('evalUserDefinedFunction');
        expect(evaluator.evalUserDefinedFunction).to.be.a('function');

        describe('.evalUserDefinedFunction()', function () {
            it('should throw an error, if the argument isn\'t a cons', function () {
                expect(evaluator.evalUserDefinedFunction).to.throw('(evalUserDefinedFunction): expected a SchemeCons but got a `undefined`!');
                expect(evaluator.evalUserDefinedFunction.bind(evaluator, evaluator.environment.getBindingFor(new SchemeSymbol('+')), true)).to.throw('(evalUserDefinedFunction): expected a SchemeCons but got a `boolean`!');
            });
            
            it('should eval userdefined functions', function () {
                var symb = new SchemeSymbol('add4'),
                    args = new SchemeCons(new SchemeSymbol('x'), new SchemeNil()),
                    body = new SchemeCons(new SchemeCons(new SchemeSymbol('+'), new SchemeCons(new SchemeSymbol('x'), new SchemeCons(new SchemeNumber(4), new SchemeNil()))), new SchemeNil());

                evaluator.environment.addBindingFor(symb, new SchemeUserDefinedFunction(args, body, evaluator.environment));
                expect(evaluator.evalCons(new SchemeCons(symb, new SchemeCons(new SchemeNumber(3), new SchemeNil())))).to.deep.equal(new SchemeNumber(7));
            });

            
            it('should eval the arguments', function () {
                var temp = new SchemeSymbol('dummy'),
                    symb = new SchemeSymbol('add5'),
                    args = new SchemeCons(new SchemeSymbol('x'), new SchemeNil()),
                    body = new SchemeCons(new SchemeCons(new SchemeSymbol('+'), new SchemeCons(new SchemeSymbol('x'), new SchemeCons(new SchemeNumber(5), new SchemeNil()))), new SchemeNil());

                evaluator.environment.addBindingFor(temp, new SchemeNumber(10));
                evaluator.environment.addBindingFor(symb, new SchemeUserDefinedFunction(args, body, evaluator.environment));
                expect(evaluator.evalCons(new SchemeCons(symb, new SchemeCons(temp, new SchemeNil())))).to.deep.equal(new SchemeNumber(15));
            });
        });
    });

});
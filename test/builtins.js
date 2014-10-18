/**
 * Tests für den Reader
 */

var chai = require('chai'),
    expect = chai.expect,
    fs = require('fs');

var builtinFunctions  = require('../src/builtins'),
    SchemeEvaluator   = require('../src/evaluator'),
    SchemeEnvironment = require('../src/objects/environment'),
    SchemeBuiltinFunction = require('../src/objects/builtinfunction'),
    SchemeUserDefinedFunction = require('../src/objects/userdefinedfunction'),
    SchemeNumber = require('../src/objects/number'),
    SchemeSymbol = require('../src/objects/symbol'),
    SchemeString = require('../src/objects/string'),
    SchemeTrue   = require('../src/objects/true'),
    SchemeFalse  = require('../src/objects/false'),
    SchemeCons   = require('../src/objects/cons'),
    SchemeNil    = require('../src/objects/nil');


describe('builtinFunctions', function () {
    var evaluator = new SchemeEvaluator();

    it('should have a `SchemeBuiltinFunctionDisplay` function', function () {
        expect(builtinFunctions).to.have.a.property('SchemeBuiltinFunctionDisplay');
        expect(builtinFunctions.SchemeBuiltinFunctionDisplay).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionDisplay.isSchemeBuiltinFunction).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionDisplay.symbol).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionDisplay.symbol.equals(new SchemeSymbol('display'))).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionDisplay.operation).to.be.a('function');


        describe('.SchemeBuiltinFunctionDisplay()', function () {
            it('should display text', function () {
                var value = new SchemeString('test string');
                var test = new SchemeCons(value, new SchemeNil());
                var fnc = builtinFunctions.SchemeBuiltinFunctionDisplay.operation(test, evaluator.environment, evaluator);

                expect(fnc).to.be.an.instanceOf(SchemeString);
                expect(fnc).to.deep.equal(value);
                expect(value.equals(fnc)).to.be.true;
            });

            it('should display numbers', function () {
                var value = new SchemeNumber(9);
                var test = new SchemeCons(value, new SchemeNil());
                var fnc = builtinFunctions.SchemeBuiltinFunctionDisplay.operation(test, evaluator.environment, evaluator);

                expect(fnc).to.be.an.instanceOf(SchemeNumber);
                expect(fnc).to.deep.equal(value);
                expect(value.equals(fnc)).to.be.true;
            });

            it('should display cons', function () {
                var value = new SchemeCons(new SchemeString('test string'), new SchemeNil());
                var test = new SchemeCons(new SchemeCons(new SchemeSymbol('cons'), value));
                var fnc = builtinFunctions.SchemeBuiltinFunctionDisplay.operation(test, evaluator.environment, evaluator);

                expect(fnc).to.be.an.instanceOf(SchemeCons);
                expect(fnc).to.deep.equal(value);
                expect(value.equals(fnc)).to.be.true;
            });

            it('should display booleans', function () {
                var value = new SchemeTrue();
                var test = new SchemeCons(value, new SchemeNil());
                var fnc = builtinFunctions.SchemeBuiltinFunctionDisplay.operation(test, evaluator.environment, evaluator);

                expect(fnc).to.be.an.instanceOf(SchemeTrue);
                expect(fnc).to.deep.equal(value);
                expect(value.equals(fnc)).to.be.true;
            });

            // Zum testen genuegt das generelle Vorhandensein einer evaluierung
            it('should display evaluated content', function () {
                var value = new SchemeSymbol('a');

                evaluator.environment.addBindingFor(value, 10);

                var test = new SchemeCons(value, new SchemeNil());
                var fnc = builtinFunctions.SchemeBuiltinFunctionDisplay.operation(test, evaluator.environment, evaluator);

                expect(fnc).to.be.a('number');
                expect(fnc).to.equal(10);
            });
        });
    });

    it('should have a `SchemeBuiltinFunctionPlus` function', function () {
        expect(builtinFunctions).to.have.a.property('SchemeBuiltinFunctionPlus');
        expect(builtinFunctions.SchemeBuiltinFunctionPlus).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionPlus.isSchemeBuiltinFunction).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionPlus.symbol).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionPlus.symbol.equals(new SchemeSymbol('+'))).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionPlus.operation).to.be.a('function');



        describe('.SchemeBuiltinFunctionPlus()', function () {
            it('should calc with nil', function () {
                var value = new SchemeNumber(2);
                var ref = new SchemeNumber(value.value);
                var test = new SchemeCons(value, new SchemeNil());
                var fnc = builtinFunctions.SchemeBuiltinFunctionPlus.operation(test, evaluator.environment, evaluator);

                expect(fnc).to.be.an.instanceOf(SchemeNumber);
                expect(fnc).to.deep.equal(ref);
                expect(ref.equals(fnc)).to.be.true;
            });

            it('should calc with positive values', function () {
                var value = new SchemeNumber(2);
                var ref = new SchemeNumber(value.value + value.value);
                var test = new SchemeCons(value, new SchemeCons(value, new SchemeNil()));
                var fnc = builtinFunctions.SchemeBuiltinFunctionPlus.operation(test, evaluator.environment, evaluator);

                expect(fnc).to.be.an.instanceOf(SchemeNumber);
                expect(fnc).to.deep.equal(ref);
                expect(ref.equals(fnc)).to.be.true;
            });

            it('should calc with negative values', function () {
                var value = new SchemeNumber(-2);
                var ref = new SchemeNumber(value.value + value.value);
                var test = new SchemeCons(value, new SchemeCons(value, new SchemeNil()));
                var fnc = builtinFunctions.SchemeBuiltinFunctionPlus.operation(test, evaluator.environment, evaluator);

                expect(fnc).to.be.an.instanceOf(SchemeNumber);
                expect(fnc).to.deep.equal(ref);
                expect(ref.equals(fnc)).to.be.true;
            });

            it('should calc with more than 2 values', function () {
                var value = new SchemeNumber(2);
                var ref = new SchemeNumber(value.value + value.value + value.value + value.value);
                var test = new SchemeCons(value, new SchemeCons(value, new SchemeCons(value, new SchemeCons(value, new SchemeNil()))));
                var fnc = builtinFunctions.SchemeBuiltinFunctionPlus.operation(test, evaluator.environment, evaluator);
                
                expect(fnc).to.be.an.instanceOf(SchemeNumber);
                expect(fnc).to.deep.equal(ref);
                expect(ref.equals(fnc)).to.be.true;
            });

            it('should calc with more than 2 mixed values', function () {
                var value1 = new SchemeNumber(2);
                var value2 = new SchemeNumber(-3);
                var ref = new SchemeNumber(value1.value + value1.value + value2.value + value1.value);
                var test = new SchemeCons(value1, new SchemeCons(value1, new SchemeCons(value2, new SchemeCons(value1, new SchemeNil()))));
                var fnc = builtinFunctions.SchemeBuiltinFunctionPlus.operation(test, evaluator.environment, evaluator);
                
                expect(fnc).to.be.an.instanceOf(SchemeNumber);
                expect(fnc).to.deep.equal(ref);
                expect(ref.equals(fnc)).to.be.true;
            });
        });
    });

    it('should have a `SchemeBuiltinFunctionMinus` function', function () {
        expect(builtinFunctions).to.have.a.property('SchemeBuiltinFunctionMinus');
        expect(builtinFunctions.SchemeBuiltinFunctionMinus).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionMinus.isSchemeBuiltinFunction).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionMinus.symbol).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionMinus.symbol.equals(new SchemeSymbol('-'))).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionMinus.operation).to.be.a('function');


        describe('.SchemeBuiltinFunctionMinus()', function () {
            it('should calc with nil', function () {
                var value = new SchemeNumber(2);
                var ref = new SchemeNumber(-value.value);
                var test = new SchemeCons(value, new SchemeNil());
                var fnc = builtinFunctions.SchemeBuiltinFunctionMinus.operation(test, evaluator.environment, evaluator);

                expect(fnc).to.be.an.instanceOf(SchemeNumber);
                expect(fnc).to.deep.equal(ref);
                expect(ref.equals(fnc)).to.be.true;
            });

            it('should calc with positive values', function () {
                var value = new SchemeNumber(2);
                var ref = new SchemeNumber(value.value - value.value);
                var test = new SchemeCons(value, new SchemeCons(value, new SchemeNil()));
                var fnc = builtinFunctions.SchemeBuiltinFunctionMinus.operation(test, evaluator.environment, evaluator);

                expect(fnc).to.be.an.instanceOf(SchemeNumber);
                expect(fnc).to.deep.equal(ref);
                expect(ref.equals(fnc)).to.be.true;
            });

            it('should calc with negative values', function () {
                var value = new SchemeNumber(-2);
                var ref = new SchemeNumber(value.value - value.value);
                var test = new SchemeCons(value, new SchemeCons(value, new SchemeNil()));
                var fnc = builtinFunctions.SchemeBuiltinFunctionMinus.operation(test, evaluator.environment, evaluator);

                expect(fnc).to.be.an.instanceOf(SchemeNumber);
                expect(fnc).to.deep.equal(ref);
                expect(ref.equals(fnc)).to.be.true;
            });

            it('should calc with more than 2 values', function () {
                var value = new SchemeNumber(2);
                var ref = new SchemeNumber(value.value - value.value - value.value - value.value);
                var test = new SchemeCons(value, new SchemeCons(value, new SchemeCons(value, new SchemeCons(value, new SchemeNil()))));
                var fnc = builtinFunctions.SchemeBuiltinFunctionMinus.operation(test, evaluator.environment, evaluator);
                
                expect(fnc).to.be.an.instanceOf(SchemeNumber);
                expect(fnc).to.deep.equal(ref);
                expect(ref.equals(fnc)).to.be.true;
            });

            it('should calc with more than 2 mixed values', function () {
                var value1 = new SchemeNumber(2);
                var value2 = new SchemeNumber(-3);
                var ref = new SchemeNumber(value1.value - value1.value - value2.value - value1.value);
                var test = new SchemeCons(value1, new SchemeCons(value1, new SchemeCons(value2, new SchemeCons(value1, new SchemeNil()))));
                var fnc = builtinFunctions.SchemeBuiltinFunctionMinus.operation(test, evaluator.environment, evaluator);
                
                expect(fnc).to.be.an.instanceOf(SchemeNumber);
                expect(fnc).to.deep.equal(ref);
                expect(ref.equals(fnc)).to.be.true;
            });
        });
    });

    it('should have a `SchemeBuiltinFunctionMultiply` function', function () {
        expect(builtinFunctions).to.have.a.property('SchemeBuiltinFunctionMultiply');
        expect(builtinFunctions.SchemeBuiltinFunctionMultiply).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionMultiply.isSchemeBuiltinFunction).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionMultiply.symbol).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionMultiply.symbol.equals(new SchemeSymbol('*'))).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionMultiply.operation).to.be.a('function');


        describe('.SchemeBuiltinFunctionMultiply()', function () {
            it('should calc with nil', function () {
                var value = new SchemeNumber(2);
                var ref = new SchemeNumber(value.value);
                var test = new SchemeCons(value, new SchemeNil());
                var fnc = builtinFunctions.SchemeBuiltinFunctionMultiply.operation(test, evaluator.environment, evaluator);

                expect(fnc).to.be.an.instanceOf(SchemeNumber);
                expect(fnc).to.deep.equal(ref);
                expect(ref.equals(fnc)).to.be.true;
            });

            it('should calc with positive values', function () {
                var value = new SchemeNumber(2);
                var ref = new SchemeNumber(value.value * value.value);
                var test = new SchemeCons(value, new SchemeCons(value, new SchemeNil()));
                var fnc = builtinFunctions.SchemeBuiltinFunctionMultiply.operation(test, evaluator.environment, evaluator);

                expect(fnc).to.be.an.instanceOf(SchemeNumber);
                expect(fnc).to.deep.equal(ref);
                expect(ref.equals(fnc)).to.be.true;
            });

            it('should calc with negative values', function () {
                var value = new SchemeNumber(-2);
                var ref = new SchemeNumber(value.value * value.value);
                var test = new SchemeCons(value, new SchemeCons(value, new SchemeNil()));
                var fnc = builtinFunctions.SchemeBuiltinFunctionMultiply.operation(test, evaluator.environment, evaluator);

                expect(fnc).to.be.an.instanceOf(SchemeNumber);
                expect(fnc).to.deep.equal(ref);
                expect(ref.equals(fnc)).to.be.true;
            });

            it('should calc with 0', function () {
                var value = new SchemeNumber(2);
                var ref = new SchemeNumber(0);
                var test = new SchemeCons(value, new SchemeCons(ref, new SchemeNil()));
                var fnc = builtinFunctions.SchemeBuiltinFunctionMultiply.operation(test, evaluator.environment, evaluator);

                expect(fnc).to.be.an.instanceOf(SchemeNumber);
                expect(fnc).to.deep.equal(ref);
                expect(ref.equals(fnc)).to.be.true;
            });

            it('should calc with more than 2 values', function () {
                var value = new SchemeNumber(2);
                var ref = new SchemeNumber(value.value * value.value * value.value * value.value);
                var test = new SchemeCons(value, new SchemeCons(value, new SchemeCons(value, new SchemeCons(value, new SchemeNil()))));
                var fnc = builtinFunctions.SchemeBuiltinFunctionMultiply.operation(test, evaluator.environment, evaluator);
                
                expect(fnc).to.be.an.instanceOf(SchemeNumber);
                expect(fnc).to.deep.equal(ref);
                expect(ref.equals(fnc)).to.be.true;
            });

            it('should calc with more than 2 mixed values', function () {
                var value1 = new SchemeNumber(2);
                var value2 = new SchemeNumber(-3);
                var ref = new SchemeNumber(value1.value * value1.value * value2.value * value1.value);
                var test = new SchemeCons(value1, new SchemeCons(value1, new SchemeCons(value2, new SchemeCons(value1, new SchemeNil()))));
                var fnc = builtinFunctions.SchemeBuiltinFunctionMultiply.operation(test, evaluator.environment, evaluator);
                
                expect(fnc).to.be.an.instanceOf(SchemeNumber);
                expect(fnc).to.deep.equal(ref);
                expect(ref.equals(fnc)).to.be.true;
            });
        });
    });

    it('should have a `SchemeBuiltinFunctionDivide` function', function () {
        expect(builtinFunctions).to.have.a.property('SchemeBuiltinFunctionDivide');
        expect(builtinFunctions.SchemeBuiltinFunctionDivide).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionDivide.isSchemeBuiltinFunction).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionDivide.symbol).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionDivide.symbol.equals(new SchemeSymbol('/'))).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionDivide.operation).to.be.a('function');


        describe('.SchemeBuiltinFunctionDivide()', function () {
            it('should calc with nil', function () {
                var value = new SchemeNumber(2);
                var ref = new SchemeNumber(value.value);
                var test = new SchemeCons(value, new SchemeNil());
                var fnc = builtinFunctions.SchemeBuiltinFunctionDivide.operation(test, evaluator.environment, evaluator);

                expect(fnc).to.be.an.instanceOf(SchemeNumber);
                expect(fnc).to.deep.equal(ref);
                expect(ref.equals(fnc)).to.be.true;
            });

            it('should calc with positive values', function () {
                var value = new SchemeNumber(2);
                var ref = new SchemeNumber(value.value / value.value);
                var test = new SchemeCons(value, new SchemeCons(value, new SchemeNil()));
                var fnc = builtinFunctions.SchemeBuiltinFunctionDivide.operation(test, evaluator.environment, evaluator);

                expect(fnc).to.be.an.instanceOf(SchemeNumber);
                expect(fnc).to.deep.equal(ref);
                expect(ref.equals(fnc)).to.be.true;
            });

            it('should calc with negative values', function () {
                var value = new SchemeNumber(-2);
                var ref = new SchemeNumber(value.value / value.value);
                var test = new SchemeCons(value, new SchemeCons(value, new SchemeNil()));
                var fnc = builtinFunctions.SchemeBuiltinFunctionDivide.operation(test, evaluator.environment, evaluator);

                expect(fnc).to.be.an.instanceOf(SchemeNumber);
                expect(fnc).to.deep.equal(ref);
                expect(ref.equals(fnc)).to.be.true;
            });

            it('should not calc with 0', function () {
                var value = new SchemeNumber(2);
                var ref = new SchemeNumber(0);
                var test = new SchemeCons(value, new SchemeCons(ref, new SchemeNil()));

                expect(builtinFunctions
                        .SchemeBuiltinFunctionDivide
                            .operation.bind(
                                builtinFunctions.SchemeBuiltinFunctionDivide,
                                test,
                                evaluator.environment,
                                evaluator
                            )
                        ).to.throw('(/): division by zero');
            });

            it('should calc with more than 2 values', function () {
                var value = new SchemeNumber(2);
                var ref = new SchemeNumber(value.value / value.value / value.value / value.value);
                var test = new SchemeCons(value, new SchemeCons(value, new SchemeCons(value, new SchemeCons(value, new SchemeNil()))));
                var fnc = builtinFunctions.SchemeBuiltinFunctionDivide.operation(test, evaluator.environment, evaluator);
                
                expect(fnc).to.be.an.instanceOf(SchemeNumber);
                expect(fnc).to.deep.equal(ref);
                expect(ref.equals(fnc)).to.be.true;
            });

            it('should calc with more than 2 mixed values', function () {
                var value1 = new SchemeNumber(2);
                var value2 = new SchemeNumber(-3);
                var ref = new SchemeNumber(value1.value / value1.value / value2.value / value1.value);
                var test = new SchemeCons(value1, new SchemeCons(value1, new SchemeCons(value2, new SchemeCons(value1, new SchemeNil()))));
                var fnc = builtinFunctions.SchemeBuiltinFunctionDivide.operation(test, evaluator.environment, evaluator);
                
                expect(fnc).to.be.an.instanceOf(SchemeNumber);
                expect(fnc).to.deep.equal(ref);
                expect(ref.equals(fnc)).to.be.true;
            });
        });
    });

    it('should have a `SchemeBuiltinFunctionDefine` function', function () {
        expect(builtinFunctions).to.have.a.property('SchemeBuiltinFunctionDefine');
        expect(builtinFunctions.SchemeBuiltinFunctionDefine).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionDefine.isSchemeBuiltinFunction).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionDefine.symbol).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionDefine.symbol.equals(new SchemeSymbol('define'))).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionDefine.operation).to.be.a('function');

        describe('.SchemeBuiltinFunctionDefine()', function () {
            it('should define new variables', function () {
                var key = new SchemeSymbol('defineDummy');
                var val = new SchemeNumber(2);
                var test = new SchemeCons(key, new SchemeCons(val));
                var fnc;

                expect(evaluator.environment.getBindingFor(key)).to.deep.equal(new SchemeNil());
                fnc = builtinFunctions.SchemeBuiltinFunctionDefine.operation(test, evaluator.environment, evaluator);
                expect(evaluator.environment.getBindingFor(key)).to.deep.equal(val);
            });

            it('should only consider the current environments local bindings', function () {
                var key = new SchemeSymbol('defineDummy2');
                var val = new SchemeNumber(2);
                var dummy = new SchemeString('Yepp');
                var test = new SchemeCons(key, new SchemeCons(val));
                var fnc;
                var env1 = evaluator.environment;
                var env2 = new SchemeEnvironment(evaluator.environment);

                env1.addBindingFor(key, dummy);
                expect(env1.getBindingFor(key)).to.deep.equal(dummy);
                expect(env2.getBindingFor(key)).to.deep.equal(dummy);
                fnc = builtinFunctions.SchemeBuiltinFunctionDefine.operation(test, env2, evaluator);

                expect(env2.getBindingFor(key)).to.deep.equal(val);
                expect(env1.getBindingFor(key)).to.deep.equal(dummy);
            });

            it('should define new functions', function () {
                var key = new SchemeSymbol('defineDummy3');
                var val = new SchemeNumber(2);
                var test = new SchemeCons(new SchemeCons(key, new SchemeSymbol('x')), new SchemeCons(new SchemeSymbol('+'), new SchemeCons(new SchemeNumber(2), new SchemeNumber(2))));
                var fnc;

                expect(evaluator.environment.getBindingFor(key)).to.deep.equal(new SchemeNil());
                fnc = builtinFunctions.SchemeBuiltinFunctionDefine.operation(test, evaluator.environment, evaluator);
                expect(evaluator.environment.getBindingFor(key)).to.be.an('object');
                expect(evaluator.environment.getBindingFor(key).toString()).to.equal('<user-defined-function>');
                expect(fnc.toString()).to.equal('<user-defined-function>');
                expect(fnc.args).to.be.an('object');
                expect(fnc.args).to.deep.equal(new SchemeSymbol('x'));
                expect(fnc.bodyList).to.be.an('object');
                expect(fnc.bodyList).to.deep.equal(new SchemeCons(new SchemeSymbol('begin'), new SchemeCons(new SchemeSymbol('+'), new SchemeCons(new SchemeNumber(2), new SchemeNumber(2)))));
                expect(fnc.environment).to.be.an('object');
                expect(fnc.environment).to.deep.equal(evaluator.environment);
            });

            it('should change an existing binding', function () {
                var key = new SchemeSymbol('defineDummy4');
                var val1 = new SchemeNumber(2);
                var val2 = new SchemeNumber(2);
                var test1 = new SchemeCons(key, new SchemeCons(val1));
                var test2 = new SchemeCons(key, new SchemeCons(val2));
                var fnc;

                expect(evaluator.environment.getBindingFor(key)).to.deep.equal(new SchemeNil());
                fnc = builtinFunctions.SchemeBuiltinFunctionDefine.operation(test1, evaluator.environment, evaluator);
                expect(evaluator.environment.getBindingFor(key)).to.deep.equal(val1);
                fnc = builtinFunctions.SchemeBuiltinFunctionDefine.operation(test2, evaluator.environment, evaluator);
                expect(evaluator.environment.getBindingFor(key)).to.deep.equal(val2);
            });

            it('should throw an error, if the argument isn\'t a symbol/cons', function () {
                expect(builtinFunctions.SchemeBuiltinFunctionDefine.operation.bind(builtinFunctions.SchemeBuiltinFunctionDefine, new SchemeCons(new SchemeNil(), new SchemeNil()))).to.throw('(define): argument is not a symbol or cons!');
            });
        });
    });

    it('should have a `SchemeBuiltinFunctionCons` function', function () {
        expect(builtinFunctions).to.have.a.property('SchemeBuiltinFunctionCons');
        expect(builtinFunctions.SchemeBuiltinFunctionCons).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionCons.isSchemeBuiltinFunction).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionCons.symbol).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionCons.symbol.equals(new SchemeSymbol('cons'))).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionCons.operation).to.be.a('function');


        describe('.SchemeBuiltinFunctionCons()', function () {
            it('should return a new SchemeCons', function () {
                var dummy = new SchemeCons(new SchemeNumber(1), new SchemeCons(new SchemeNumber(2), new SchemeNil()));
                expect(builtinFunctions.SchemeBuiltinFunctionCons.operation(dummy, evaluator.environment, evaluator)).to.deep.equal(new SchemeCons(new SchemeNumber(1), new SchemeNumber(2)));
            });

            it('should evaluate the arguments', function () {
                evaluator.environment.addBindingFor(new SchemeSymbol('dummyCons'), new SchemeString('Yepp'));
                expect(builtinFunctions.SchemeBuiltinFunctionCons.operation(new SchemeCons(new SchemeSymbol('dummyCons'), new SchemeCons(new SchemeNumber(2), new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(new SchemeCons(new SchemeString('Yepp'), new SchemeNumber(2)));
            });
        });
    });

    it('should have a `SchemeBuiltinFunctionList` function', function () {
        expect(builtinFunctions).to.have.a.property('SchemeBuiltinFunctionList');
        expect(builtinFunctions.SchemeBuiltinFunctionList).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionList.isSchemeBuiltinFunction).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionList.symbol).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionList.symbol.equals(new SchemeSymbol('list'))).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionList.operation).to.be.a('function');


        describe('.SchemeBuiltinFunctionList()', function () {
            it('should create a list', function () {
                var cons = new SchemeCons(
                        new SchemeNumber(1),
                        new SchemeCons(
                            new SchemeNumber(2),
                            new SchemeCons(
                                new SchemeNumber(3),
                                new SchemeCons(
                                    new SchemeNumber(4),
                                    new SchemeNil()
                                )
                            )
                        )
                    );
                expect(builtinFunctions.SchemeBuiltinFunctionList.operation(cons, evaluator.environment, evaluator)).to.deep.equal(cons);
            });

            it('should create an evaluated list', function () {
                var cons, expected;
                var binding = new SchemeSymbol('dummyList');
                var value = new SchemeNumber(999);

                evaluator.environment.addBindingFor(binding, value);

                cons = new SchemeCons(
                        new SchemeNumber(1),
                        new SchemeCons(
                            new SchemeNumber(2),
                            new SchemeCons(
                                new SchemeNumber(3),
                                new SchemeCons(
                                    new SchemeSymbol('dummyList'),
                                    new SchemeNil()
                                )
                            )
                        )
                    );
                expected = new SchemeCons(
                        new SchemeNumber(1),
                        new SchemeCons(
                            new SchemeNumber(2),
                            new SchemeCons(
                                new SchemeNumber(3),
                                new SchemeCons(
                                    new SchemeNumber(999),
                                    new SchemeNil()
                                )
                            )
                        )
                    );
                expect(builtinFunctions.SchemeBuiltinFunctionList.operation(cons, evaluator.environment, evaluator)).to.deep.equal(expected);
            });
        });
    });

    it('should have a `SchemeBuiltinFunctionCar` function', function () {
        expect(builtinFunctions).to.have.a.property('SchemeBuiltinFunctionCar');
        expect(builtinFunctions.SchemeBuiltinFunctionCar).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionCar.isSchemeBuiltinFunction).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionCar.symbol).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionCar.symbol.equals(new SchemeSymbol('car'))).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionCar.operation).to.be.a('function');


        describe('.SchemeBuiltinFunctionCar()', function () {
            it('should return the con\'s car', function () {
                expect(builtinFunctions.SchemeBuiltinFunctionCar.operation(new SchemeCons(new SchemeCons(new SchemeSymbol('cons'), new SchemeCons(new SchemeNumber(1), new SchemeCons(new SchemeNumber(2), new SchemeNil())), new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(new SchemeNumber(1));
            });
            
            it('should return the evaluated con\'s car', function () {
                var key = new SchemeSymbol('dummyCar');
                var value = new SchemeCons(new SchemeNumber(999), new SchemeNil());

                evaluator.environment.addBindingFor(key, value);

                expect(builtinFunctions.SchemeBuiltinFunctionCar.operation(new SchemeCons(key, new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeNumber(999));
            });
            
            it('should throw an error, if the argument isn\'t a cons', function () {
                expect(builtinFunctions.SchemeBuiltinFunctionCar.operation.bind(builtinFunctions.SchemeBuiltinFunctionCar.operation, new SchemeCons(new SchemeNumber(1), new SchemeNil()), evaluator.environment, evaluator)).to.throw('(car): argument is not a cons!');
            });
        });
    });

    it('should have a `SchemeBuiltinFunctionCdr` function', function () {
        expect(builtinFunctions).to.have.a.property('SchemeBuiltinFunctionCdr');
        expect(builtinFunctions.SchemeBuiltinFunctionCdr).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionCdr.isSchemeBuiltinFunction).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionCdr.symbol).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionCdr.symbol.equals(new SchemeSymbol('cdr'))).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionCdr.operation).to.be.a('function');


        describe('.SchemeBuiltinFunctionCdr()', function () {
            it('should return the con\'s cdr', function () {
                expect(builtinFunctions.SchemeBuiltinFunctionCdr.operation(new SchemeCons(new SchemeCons(new SchemeSymbol('cons'), new SchemeCons(new SchemeNumber(1), new SchemeCons(new SchemeNumber(2), new SchemeNil())), new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(new SchemeNumber(2));
            });
            
            it('should return the evaluated con\'s cdr', function () {
                var key = new SchemeSymbol('dummyCdr');
                var value = new SchemeCons(new SchemeNil(), new SchemeNumber(999));

                evaluator.environment.addBindingFor(key, value);

                expect(builtinFunctions.SchemeBuiltinFunctionCdr.operation(new SchemeCons(key, new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeNumber(999));
            });
            
            it('should throw an error, if the argument isn\'t a cons', function () {
                expect(builtinFunctions.SchemeBuiltinFunctionCdr.operation.bind(builtinFunctions.SchemeBuiltinFunctionCar.operation, new SchemeCons(new SchemeNumber(1), new SchemeNil()), evaluator.environment, evaluator)).to.throw('(cdr): argument is not a cons!');
            });
        });
    });

    it('should have a `SchemeBuiltinFunctionIsEqSign` function', function () {
        expect(builtinFunctions).to.have.a.property('SchemeBuiltinFunctionIsEqSign');
        expect(builtinFunctions.SchemeBuiltinFunctionIsEqSign).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionIsEqSign.isSchemeBuiltinFunction).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionIsEqSign.symbol).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionIsEqSign.symbol.equals(new SchemeSymbol('='))).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionIsEqSign.operation).to.be.a('function');


        describe('.SchemeBuiltinFunctionIsEqSign()', function () {
            it('should return true if argument 1 is = argument 2', function () {
                expect(builtinFunctions.SchemeBuiltinFunctionIsEqSign.operation(new SchemeCons(new SchemeNumber(1), new SchemeCons(new SchemeNumber(1), new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(new SchemeTrue());
            });
            it('should return false if argument 1 is > or = argument 2', function () {
                expect(builtinFunctions.SchemeBuiltinFunctionIsEqSign.operation(new SchemeCons(new SchemeNumber(2), new SchemeCons(new SchemeNumber(1), new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
                expect(builtinFunctions.SchemeBuiltinFunctionIsEqSign.operation(new SchemeCons(new SchemeNumber(1), new SchemeCons(new SchemeNumber(2), new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
            });

            it('should throw an error, if an argument is not a number', function () {
                expect(builtinFunctions.SchemeBuiltinFunctionIsEqSign.operation.bind(this, new SchemeCons(new SchemeString('hi'), new SchemeCons(new SchemeNumber(1), new SchemeNil())), evaluator.environment, evaluator)).to.throw('(=): argument is not a number!');
                expect(builtinFunctions.SchemeBuiltinFunctionIsEqSign.operation.bind(this, new SchemeCons(new SchemeNumber(1), new SchemeCons(new SchemeString('hi'), new SchemeNil())), evaluator.environment, evaluator)).to.throw('(=): argument is not a number!');
            });
        });
    });

    it('should have a `SchemeBuiltinFunctionLowerThan` function', function () {
        expect(builtinFunctions).to.have.a.property('SchemeBuiltinFunctionLowerThan');
        expect(builtinFunctions.SchemeBuiltinFunctionLowerThan).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionLowerThan.isSchemeBuiltinFunction).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionLowerThan.symbol).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionLowerThan.symbol.equals(new SchemeSymbol('<'))).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionLowerThan.operation).to.be.a('function');


        describe('.SchemeBuiltinFunctionLowerThan()', function () {
            it('should return true if argument 1 is < argument 2', function () {
                expect(builtinFunctions.SchemeBuiltinFunctionLowerThan.operation(new SchemeCons(new SchemeNumber(1), new SchemeCons(new SchemeNumber(2), new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(new SchemeTrue());
            });
            it('should return false if argument 1 is > or = argument 2', function () {
                expect(builtinFunctions.SchemeBuiltinFunctionLowerThan.operation(new SchemeCons(new SchemeNumber(2), new SchemeCons(new SchemeNumber(1), new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
                expect(builtinFunctions.SchemeBuiltinFunctionLowerThan.operation(new SchemeCons(new SchemeNumber(2), new SchemeCons(new SchemeNumber(2), new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
            });

            it('should throw an error, if an argument is not a number', function () {
                expect(builtinFunctions.SchemeBuiltinFunctionLowerThan.operation.bind(this, new SchemeCons(new SchemeString('hi'), new SchemeCons(new SchemeNumber(1), new SchemeNil())), evaluator.environment, evaluator)).to.throw('(<): argument is not a number!');
                expect(builtinFunctions.SchemeBuiltinFunctionLowerThan.operation.bind(this, new SchemeCons(new SchemeNumber(1), new SchemeCons(new SchemeString('hi'), new SchemeNil())), evaluator.environment, evaluator)).to.throw('(<): argument is not a number!');
            });
        });
    });

    it('should have a `SchemeBuiltinFunctionLowerThanEqual` function', function () {
        expect(builtinFunctions).to.have.a.property('SchemeBuiltinFunctionLowerThanEqual');
        expect(builtinFunctions.SchemeBuiltinFunctionLowerThanEqual).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionLowerThanEqual.isSchemeBuiltinFunction).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionLowerThanEqual.symbol).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionLowerThanEqual.symbol.equals(new SchemeSymbol('<='))).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionLowerThanEqual.operation).to.be.a('function');


        describe('.SchemeBuiltinFunctionLowerThanEqual()', function () {
            it('should return true if argument 1 is < or = argument 2', function () {
                expect(builtinFunctions.SchemeBuiltinFunctionLowerThanEqual.operation(new SchemeCons(new SchemeNumber(1), new SchemeCons(new SchemeNumber(2), new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(new SchemeTrue());
                expect(builtinFunctions.SchemeBuiltinFunctionLowerThanEqual.operation(new SchemeCons(new SchemeNumber(2), new SchemeCons(new SchemeNumber(2), new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(new SchemeTrue());
            });
            it('should return false if argument 1 is > argument 2', function () {
                expect(builtinFunctions.SchemeBuiltinFunctionLowerThanEqual.operation(new SchemeCons(new SchemeNumber(2), new SchemeCons(new SchemeNumber(1), new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
            });

            it('should throw an error, if an argument is not a number', function () {
                expect(builtinFunctions.SchemeBuiltinFunctionLowerThanEqual.operation.bind(this, new SchemeCons(new SchemeString('hi'), new SchemeCons(new SchemeNumber(1), new SchemeNil())), evaluator.environment, evaluator)).to.throw('(<=): argument is not a number!');
                expect(builtinFunctions.SchemeBuiltinFunctionLowerThanEqual.operation.bind(this, new SchemeCons(new SchemeNumber(1), new SchemeCons(new SchemeString('hi'), new SchemeNil())), evaluator.environment, evaluator)).to.throw('(<=): argument is not a number!');
            });
        });
    });

    it('should have a `SchemeBuiltinFunctionGreaterThan` function', function () {
        expect(builtinFunctions).to.have.a.property('SchemeBuiltinFunctionGreaterThan');
        expect(builtinFunctions.SchemeBuiltinFunctionGreaterThan).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionGreaterThan.isSchemeBuiltinFunction).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionGreaterThan.symbol).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionGreaterThan.symbol.equals(new SchemeSymbol('>'))).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionGreaterThan.operation).to.be.a('function');


        describe('.SchemeBuiltinFunctionGreaterThan()', function () {
            it('should return true if argument 1 is > argument 2', function () {
                expect(builtinFunctions.SchemeBuiltinFunctionGreaterThan.operation(new SchemeCons(new SchemeNumber(2), new SchemeCons(new SchemeNumber(1), new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(new SchemeTrue());
            });
            it('should return false if argument 1 is < or = argument 2', function () {
                expect(builtinFunctions.SchemeBuiltinFunctionGreaterThan.operation(new SchemeCons(new SchemeNumber(1), new SchemeCons(new SchemeNumber(2), new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
                expect(builtinFunctions.SchemeBuiltinFunctionGreaterThan.operation(new SchemeCons(new SchemeNumber(2), new SchemeCons(new SchemeNumber(2), new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
            });

            it('should throw an error, if an argument is not a number', function () {
                expect(builtinFunctions.SchemeBuiltinFunctionGreaterThan.operation.bind(this, new SchemeCons(new SchemeString('hi'), new SchemeCons(new SchemeNumber(1), new SchemeNil())), evaluator.environment, evaluator)).to.throw('(>): argument is not a number!');
                expect(builtinFunctions.SchemeBuiltinFunctionGreaterThan.operation.bind(this, new SchemeCons(new SchemeNumber(1), new SchemeCons(new SchemeString('hi'), new SchemeNil())), evaluator.environment, evaluator)).to.throw('(>): argument is not a number!');
            });
        });
    });

    it('should have a `SchemeBuiltinFunctionGreaterThanEqual` function', function () {
        expect(builtinFunctions).to.have.a.property('SchemeBuiltinFunctionGreaterThanEqual');
        expect(builtinFunctions.SchemeBuiltinFunctionGreaterThanEqual).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionGreaterThanEqual.isSchemeBuiltinFunction).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionGreaterThanEqual.symbol).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionGreaterThanEqual.symbol.equals(new SchemeSymbol('>='))).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionGreaterThanEqual.operation).to.be.a('function');


        describe('.SchemeBuiltinFunctionGreaterThanEqual()', function () {
            it('should return true if argument 1 is > or = argument 2', function () {
                expect(builtinFunctions.SchemeBuiltinFunctionGreaterThanEqual.operation(new SchemeCons(new SchemeNumber(2), new SchemeCons(new SchemeNumber(1), new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(new SchemeTrue());
                expect(builtinFunctions.SchemeBuiltinFunctionGreaterThanEqual.operation(new SchemeCons(new SchemeNumber(2), new SchemeCons(new SchemeNumber(2), new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(new SchemeTrue());
            });
            it('should return false if argument 1 is < argument 2', function () {
                expect(builtinFunctions.SchemeBuiltinFunctionGreaterThanEqual.operation(new SchemeCons(new SchemeNumber(1), new SchemeCons(new SchemeNumber(2), new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
            });

            it('should throw an error, if an argument is not a number', function () {
                expect(builtinFunctions.SchemeBuiltinFunctionGreaterThanEqual.operation.bind(this, new SchemeCons(new SchemeString('hi'), new SchemeCons(new SchemeNumber(1), new SchemeNil())), evaluator.environment, evaluator)).to.throw('(>=): argument is not a number!');
                expect(builtinFunctions.SchemeBuiltinFunctionGreaterThanEqual.operation.bind(this, new SchemeCons(new SchemeNumber(1), new SchemeCons(new SchemeString('hi'), new SchemeNil())), evaluator.environment, evaluator)).to.throw('(>=): argument is not a number!');
            });
        });
    });

    it('should have a `SchemeBuiltinFunctionIsEq` function', function () {
        expect(builtinFunctions).to.have.a.property('SchemeBuiltinFunctionIsEq');
        expect(builtinFunctions.SchemeBuiltinFunctionIsEq).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionIsEq.isSchemeBuiltinFunction).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionIsEq.symbol).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionIsEq.symbol.equals(new SchemeSymbol('eq?'))).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionIsEq.operation).to.be.a('function');


        describe('.SchemeBuiltinFunctionIsEq()', function () {
            it('should return true if both arguments are the same object', function () {
                var a = new SchemeString('hi');
                var b = a;
                var key = new SchemeSymbol('dummyIsEqv');
                evaluator.environment.addBindingFor(key, a);

                expect(builtinFunctions.SchemeBuiltinFunctionIsEq.operation(new SchemeCons(a, new SchemeCons(b, new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(new SchemeTrue());
                
                b = key;
                expect(builtinFunctions.SchemeBuiltinFunctionIsEqv.operation(new SchemeCons(a, new SchemeCons(b, new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(new SchemeTrue());
            
                // Singletons
                a = new SchemeTrue();
                b = new SchemeTrue();
                expect(builtinFunctions.SchemeBuiltinFunctionIsEq.operation(new SchemeCons(a, new SchemeCons(b, new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(new SchemeTrue());
           
                a = new SchemeFalse();
                b = new SchemeFalse();
                expect(builtinFunctions.SchemeBuiltinFunctionIsEq.operation(new SchemeCons(a, new SchemeCons(b, new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(new SchemeTrue());
           
                a = new SchemeNil();
                b = new SchemeNil();
                expect(builtinFunctions.SchemeBuiltinFunctionIsEq.operation(new SchemeCons(a, new SchemeCons(b, new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(new SchemeTrue());

            });

            it('should return false if both arguments are not the same object', function () {
                var a = new SchemeString('hi');
                var b = new SchemeString('hi du');

                expect(builtinFunctions.SchemeBuiltinFunctionIsEq.operation(new SchemeCons(a, new SchemeCons(b, new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
            
                a = new SchemeNil();
                b = new SchemeString();
                expect(builtinFunctions.SchemeBuiltinFunctionIsEq.operation(new SchemeCons(a, new SchemeCons(b, new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
            
                a = new SchemeNumber(2);
                b = new SchemeString('2');
                expect(builtinFunctions.SchemeBuiltinFunctionIsEq.operation(new SchemeCons(a, new SchemeCons(b, new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());

                a = new SchemeNumber(1);
                b = new SchemeNumber(1);
                expect(builtinFunctions.SchemeBuiltinFunctionIsEq.operation(new SchemeCons(a, new SchemeCons(b, new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
            
                a = new SchemeString('hi');
                b = new SchemeString('hi');
                expect(builtinFunctions.SchemeBuiltinFunctionIsEq.operation(new SchemeCons(a, new SchemeCons(b, new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
            });
        });
    });

    it('should have a `SchemeBuiltinFunctionIsEqv` function', function () {
        expect(builtinFunctions).to.have.a.property('SchemeBuiltinFunctionIsEqv');
        expect(builtinFunctions.SchemeBuiltinFunctionIsEqv).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionIsEqv.isSchemeBuiltinFunction).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionIsEqv.symbol).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionIsEqv.symbol.equals(new SchemeSymbol('eqv?'))).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionIsEqv.operation).to.be.a('function');


        describe('.SchemeBuiltinFunctionIsEqv()', function () {
            it('should return true if both arguments are the same object or print the same string (number/string)', function () {
                var a = new SchemeString('hi');
                var b = a;
                var key = new SchemeSymbol('dummyIsEq');
                evaluator.environment.addBindingFor(key, a);

                expect(builtinFunctions.SchemeBuiltinFunctionIsEqv.operation(new SchemeCons(a, new SchemeCons(b, new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(new SchemeTrue());

                // Singletons
                a = new SchemeTrue();
                b = new SchemeTrue();
                expect(builtinFunctions.SchemeBuiltinFunctionIsEqv.operation(new SchemeCons(a, new SchemeCons(b, new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(new SchemeTrue());
           
                a = new SchemeFalse();
                b = new SchemeFalse();
                expect(builtinFunctions.SchemeBuiltinFunctionIsEqv.operation(new SchemeCons(a, new SchemeCons(b, new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(new SchemeTrue());
           
                a = new SchemeNil();
                b = new SchemeNil();
                expect(builtinFunctions.SchemeBuiltinFunctionIsEqv.operation(new SchemeCons(a, new SchemeCons(b, new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(new SchemeTrue());

                // Value
                a = new SchemeNumber(1);
                b = new SchemeNumber(1);
                expect(builtinFunctions.SchemeBuiltinFunctionIsEqv.operation(new SchemeCons(a, new SchemeCons(b, new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(new SchemeTrue());
            
                a = new SchemeString('hi');
                b = new SchemeString('hi');
                expect(builtinFunctions.SchemeBuiltinFunctionIsEqv.operation(new SchemeCons(a, new SchemeCons(b, new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(new SchemeTrue());
            
                a = new SchemeString('hi');
                b = key;
                expect(builtinFunctions.SchemeBuiltinFunctionIsEqv.operation(new SchemeCons(a, new SchemeCons(b, new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(new SchemeTrue());
            });

            it('should return false if both arguments are not the same object', function () {
                var a = new SchemeString('hi');
                var b = new SchemeString('hi du');

                expect(builtinFunctions.SchemeBuiltinFunctionIsEqv.operation(new SchemeCons(a, new SchemeCons(b, new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
            
                a = new SchemeNil();
                b = new SchemeString();
                expect(builtinFunctions.SchemeBuiltinFunctionIsEqv.operation(new SchemeCons(a, new SchemeCons(b, new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
            
                a = new SchemeNumber(2);
                b = new SchemeString('2');
                expect(builtinFunctions.SchemeBuiltinFunctionIsEqv.operation(new SchemeCons(a, new SchemeCons(b, new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());

              });
        });
    });

    it('should have a `SchemeBuiltinFunctionIsEqual` function', function () {
        expect(builtinFunctions).to.have.a.property('SchemeBuiltinFunctionIsEqual');
        expect(builtinFunctions.SchemeBuiltinFunctionIsEqual).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionIsEqual.isSchemeBuiltinFunction).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionIsEqual.symbol).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionIsEqual.symbol.equals(new SchemeSymbol('equal?'))).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionIsEqual.operation).to.be.a('function');


        describe('.SchemeBuiltinFunctionIsEqual()', function () {
            it('should return true if both arguments have the same print-string', function () {
                var a = new SchemeString('hi');
                var b = new SchemeString('hi');
                var key = new SchemeSymbol('dummyIsEqual');
                evaluator.environment.addBindingFor(key, a);

                expect(builtinFunctions.SchemeBuiltinFunctionIsEqual.operation(new SchemeCons(a, new SchemeCons(b, new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(new SchemeTrue());
                
                b = key;
                expect(builtinFunctions.SchemeBuiltinFunctionIsEqual.operation(new SchemeCons(a, new SchemeCons(b, new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(new SchemeTrue());
            
                a = new SchemeNumber(1);
                b = new SchemeNumber(01);
                expect(builtinFunctions.SchemeBuiltinFunctionIsEqual.operation(new SchemeCons(a, new SchemeCons(b, new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(new SchemeTrue());
           
                a = new SchemeTrue();
                b = new SchemeTrue();
                expect(builtinFunctions.SchemeBuiltinFunctionIsEqual.operation(new SchemeCons(a, new SchemeCons(b, new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(new SchemeTrue());
           
                a = new SchemeFalse();
                b = new SchemeFalse();
                expect(builtinFunctions.SchemeBuiltinFunctionIsEqual.operation(new SchemeCons(a, new SchemeCons(b, new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(new SchemeTrue());
           
                a = new SchemeNil();
                b = new SchemeNil();
                expect(builtinFunctions.SchemeBuiltinFunctionIsEqual.operation(new SchemeCons(a, new SchemeCons(b, new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(new SchemeTrue());
            });

            it('should return false if both arguments don\'t have the same print-string', function () {
                var a = new SchemeString('hi');
                var b = new SchemeString('hi du');

                expect(builtinFunctions.SchemeBuiltinFunctionIsEqual.operation(new SchemeCons(a, new SchemeCons(b, new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
            
                a = new SchemeNil();
                b = new SchemeString();
                expect(builtinFunctions.SchemeBuiltinFunctionIsEqual.operation(new SchemeCons(a, new SchemeCons(b, new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
            
                a = new SchemeNumber(2);
                b = new SchemeString('2');
                expect(builtinFunctions.SchemeBuiltinFunctionIsEqual.operation(new SchemeCons(a, new SchemeCons(b, new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
            });
        });
    });

    it('should have a `SchemeBuiltinFunctionIsBoolean` function', function () {
        expect(builtinFunctions).to.have.a.property('SchemeBuiltinFunctionIsBoolean');
        expect(builtinFunctions.SchemeBuiltinFunctionIsBoolean).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionIsBoolean.isSchemeBuiltinFunction).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionIsBoolean.symbol).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionIsBoolean.symbol.equals(new SchemeSymbol('boolean?'))).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionIsBoolean.operation).to.be.a('function');


        describe('.SchemeBuiltinFunctionIsBoolean()', function () {
            it('should return true if the argument is true/false', function () {
                var key = new SchemeSymbol('dummyIsBoolean');
                var val = new SchemeTrue();

                evaluator.environment.addBindingFor(key, val);

                expect(builtinFunctions.SchemeBuiltinFunctionIsBoolean.operation(new SchemeCons(key, new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeTrue());
                expect(builtinFunctions.SchemeBuiltinFunctionIsBoolean.operation(new SchemeCons(new SchemeFalse(), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeTrue());
            });

            it('should return false if the argument is not true/false', function () {
                expect(builtinFunctions.SchemeBuiltinFunctionIsBoolean.operation(new SchemeCons(new SchemeNumber(1), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
                expect(builtinFunctions.SchemeBuiltinFunctionIsBoolean.operation(new SchemeCons(new SchemeNil(), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
                expect(builtinFunctions.SchemeBuiltinFunctionIsBoolean.operation(new SchemeCons(new SchemeUserDefinedFunction(), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
                expect(builtinFunctions.SchemeBuiltinFunctionIsBoolean.operation(new SchemeCons(new SchemeBuiltinFunction(), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
                expect(builtinFunctions.SchemeBuiltinFunctionIsBoolean.operation(new SchemeCons(new SchemeString('hi'), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
            }); 
        });
    });

    it('should have a `SchemeBuiltinFunctionIsSymbol` function', function () {
        expect(builtinFunctions).to.have.a.property('SchemeBuiltinFunctionIsSymbol');
        expect(builtinFunctions.SchemeBuiltinFunctionIsSymbol).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionIsSymbol.isSchemeBuiltinFunction).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionIsSymbol.symbol).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionIsSymbol.symbol.equals(new SchemeSymbol('symbol?'))).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionIsSymbol.operation).to.be.a('function');


        describe('.SchemeBuiltinFunctionIsSymbol()', function () {
            it('should return true if the argument is a symbol', function () {
                var key = new SchemeSymbol('dummyIsSymbol');
                var val = new SchemeSymbol('yepp');

                evaluator.environment.addBindingFor(key, val);

                expect(builtinFunctions.SchemeBuiltinFunctionIsSymbol.operation(new SchemeCons(new SchemeCons(new SchemeSymbol('quote'), new SchemeCons(new SchemeSymbol('Yippy'), new SchemeNil())), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeTrue());
            });

            it('should return false if the argument is not a symbol', function () {
                expect(builtinFunctions.SchemeBuiltinFunctionIsSymbol.operation(new SchemeCons(new SchemeTrue(), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
                expect(builtinFunctions.SchemeBuiltinFunctionIsSymbol.operation(new SchemeCons(new SchemeFalse(), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
                expect(builtinFunctions.SchemeBuiltinFunctionIsSymbol.operation(new SchemeCons(new SchemeNil(), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
                expect(builtinFunctions.SchemeBuiltinFunctionIsSymbol.operation(new SchemeCons(new SchemeUserDefinedFunction(), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
                expect(builtinFunctions.SchemeBuiltinFunctionIsSymbol.operation(new SchemeCons(new SchemeBuiltinFunction(), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
                expect(builtinFunctions.SchemeBuiltinFunctionIsSymbol.operation(new SchemeCons(new SchemeString('hi'), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
            }); 
        });
    });

    it('should have a `SchemeBuiltinFunctionIsNumber` function', function () {
        expect(builtinFunctions).to.have.a.property('SchemeBuiltinFunctionIsNumber');
        expect(builtinFunctions.SchemeBuiltinFunctionIsNumber).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionIsNumber.isSchemeBuiltinFunction).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionIsNumber.symbol).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionIsNumber.symbol.equals(new SchemeSymbol('number?'))).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionIsNumber.operation).to.be.a('function');


        describe('.SchemeBuiltinFunctionIsNumber()', function () {
            it('should return true if the argument is a number', function () {
                var key = new SchemeSymbol('dummyIsNumber');
                var val = new SchemeNumber(23);

                evaluator.environment.addBindingFor(key, val);

                expect(builtinFunctions.SchemeBuiltinFunctionIsNumber.operation(new SchemeCons(key, new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeTrue());
                expect(builtinFunctions.SchemeBuiltinFunctionIsNumber.operation(new SchemeCons(new SchemeNumber(1), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeTrue());
            });

            it('should return false if the argument is not a number', function () {
                expect(builtinFunctions.SchemeBuiltinFunctionIsNumber.operation(new SchemeCons(new SchemeTrue(), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
                expect(builtinFunctions.SchemeBuiltinFunctionIsNumber.operation(new SchemeCons(new SchemeFalse(), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
                expect(builtinFunctions.SchemeBuiltinFunctionIsNumber.operation(new SchemeCons(new SchemeNil(), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
                expect(builtinFunctions.SchemeBuiltinFunctionIsNumber.operation(new SchemeCons(new SchemeUserDefinedFunction(), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
                expect(builtinFunctions.SchemeBuiltinFunctionIsNumber.operation(new SchemeCons(new SchemeBuiltinFunction(), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
                expect(builtinFunctions.SchemeBuiltinFunctionIsNumber.operation(new SchemeCons(new SchemeString('hi'), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
            }); 
        });
    });

    it('should have a `SchemeBuiltinFunctionIsString` function', function () {
        expect(builtinFunctions).to.have.a.property('SchemeBuiltinFunctionIsString');
        expect(builtinFunctions.SchemeBuiltinFunctionIsString).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionIsString.isSchemeBuiltinFunction).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionIsString.symbol).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionIsString.symbol.equals(new SchemeSymbol('string?'))).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionIsString.operation).to.be.a('function');


        describe('.SchemeBuiltinFunctionIsString()', function () {
            it('should return true if the argument is a string', function () {
                var key = new SchemeSymbol('dummyIsString');
                var val = new SchemeString('huhu');

                evaluator.environment.addBindingFor(key, val);

                expect(builtinFunctions.SchemeBuiltinFunctionIsString.operation(new SchemeCons(key, new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeTrue());
                expect(builtinFunctions.SchemeBuiltinFunctionIsString.operation(new SchemeCons(new SchemeString('hi'), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeTrue());
            });

            it('should return false if the argument is not a string', function () {
                expect(builtinFunctions.SchemeBuiltinFunctionIsString.operation(new SchemeCons(new SchemeTrue(), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
                expect(builtinFunctions.SchemeBuiltinFunctionIsString.operation(new SchemeCons(new SchemeFalse(), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
                expect(builtinFunctions.SchemeBuiltinFunctionIsString.operation(new SchemeCons(new SchemeNil(), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
                expect(builtinFunctions.SchemeBuiltinFunctionIsString.operation(new SchemeCons(new SchemeUserDefinedFunction(), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
                expect(builtinFunctions.SchemeBuiltinFunctionIsString.operation(new SchemeCons(new SchemeBuiltinFunction(), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
                expect(builtinFunctions.SchemeBuiltinFunctionIsString.operation(new SchemeCons(new SchemeNumber(1), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
            }); 
        });
    });

    it('should have a `SchemeBuiltinFunctionIsCons` function', function () {
        expect(builtinFunctions).to.have.a.property('SchemeBuiltinFunctionIsCons');
        expect(builtinFunctions.SchemeBuiltinFunctionIsCons).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionIsCons.isSchemeBuiltinFunction).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionIsCons.symbol).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionIsCons.symbol.equals(new SchemeSymbol('cons?'))).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionIsCons.operation).to.be.a('function');

        
        describe('.SchemeBuiltinFunctionIsCons()', function () {
            it('should return true if the argument is a cons', function () {
                var key = new SchemeSymbol('dummyIsCons');
                var val = new SchemeCons(new SchemeNumber(1), new SchemeNil());

                evaluator.environment.addBindingFor(key, val);

                expect(builtinFunctions.SchemeBuiltinFunctionIsCons.operation(new SchemeCons(key, new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeTrue());
            });

            it('should return false if the argument is not a cons', function () {
                expect(builtinFunctions.SchemeBuiltinFunctionIsCons.operation(new SchemeCons(new SchemeTrue(), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
                expect(builtinFunctions.SchemeBuiltinFunctionIsCons.operation(new SchemeCons(new SchemeNil(), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
                expect(builtinFunctions.SchemeBuiltinFunctionIsCons.operation(new SchemeCons(new SchemeFalse(), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
                expect(builtinFunctions.SchemeBuiltinFunctionIsCons.operation(new SchemeCons(new SchemeString('hi'), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
                expect(builtinFunctions.SchemeBuiltinFunctionIsCons.operation(new SchemeCons(new SchemeUserDefinedFunction(), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
                expect(builtinFunctions.SchemeBuiltinFunctionIsCons.operation(new SchemeCons(new SchemeBuiltinFunction(), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
               expect(builtinFunctions.SchemeBuiltinFunctionIsCons.operation(new SchemeCons(new SchemeNumber(1), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
            }); 
        });
    });

    it('should have a `SchemeBuiltinFunctionIsNil` function', function () {
        expect(builtinFunctions).to.have.a.property('SchemeBuiltinFunctionIsNil');
        expect(builtinFunctions.SchemeBuiltinFunctionIsNil).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionIsNil.isSchemeBuiltinFunction).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionIsNil.symbol).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionIsNil.symbol.equals(new SchemeSymbol('null?'))).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionIsNil.operation).to.be.a('function');

        
        describe('.SchemeBuiltinFunctionIsNil()', function () {
            it('should return true if the argument is nil', function () {
                var key = new SchemeSymbol('dummyNil');
                var val = new SchemeNil();

                evaluator.environment.addBindingFor(key, val);

                expect(builtinFunctions.SchemeBuiltinFunctionIsNil.operation(new SchemeCons(key, new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeTrue());
                expect(builtinFunctions.SchemeBuiltinFunctionIsNil.operation(new SchemeCons(new SchemeNil(), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeTrue());
            });

            it('should return false if the argument is not nil', function () {
                expect(builtinFunctions.SchemeBuiltinFunctionIsNil.operation(new SchemeCons(new SchemeTrue(), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
                expect(builtinFunctions.SchemeBuiltinFunctionIsNil.operation(new SchemeCons(new SchemeFalse(), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
                expect(builtinFunctions.SchemeBuiltinFunctionIsNil.operation(new SchemeCons(new SchemeString('hi'), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
                expect(builtinFunctions.SchemeBuiltinFunctionIsNil.operation(new SchemeCons(new SchemeUserDefinedFunction(), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
                expect(builtinFunctions.SchemeBuiltinFunctionIsNil.operation(new SchemeCons(new SchemeBuiltinFunction(), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
                expect(builtinFunctions.SchemeBuiltinFunctionIsNil.operation(new SchemeCons(new SchemeNumber(1), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
            }); 
        });
    });

    it('should have a `SchemeBuiltinFunctionType` function', function () {
        expect(builtinFunctions).to.have.a.property('SchemeBuiltinFunctionType');
        expect(builtinFunctions.SchemeBuiltinFunctionType).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionType.isSchemeBuiltinFunction).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionType.symbol).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionType.symbol.equals(new SchemeSymbol('type?'))).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionType.operation).to.be.a('function');


        describe('.SchemeBuiltinFunctionType()', function () {
            it('should return the type', function () {
                var bif = builtinFunctions.SchemeBuiltinFunctionType.operation;
                var key = new SchemeSymbol('dummyType');
                var val = new SchemeCons(new SchemeNumber(1), new SchemeNil());

                evaluator.environment.addBindingFor(key, val);

                expect(bif(new SchemeCons(new SchemeString('hi'), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeString('SchemeString'));
                expect(bif(new SchemeCons(key, new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeString('SchemeCons'));
                expect(bif(new SchemeCons(new SchemeFalse(), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeString('SchemeFalse'));
                expect(bif(new SchemeCons(new SchemeTrue(), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeString('SchemeTrue'));
                expect(bif(new SchemeCons(new SchemeNil(), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeString('SchemeNil'));
                expect(bif(new SchemeCons(new SchemeCons(new SchemeSymbol('quote'), new SchemeCons(new SchemeSymbol('hi'), new SchemeNil()))), evaluator.environment, evaluator)).to.deep.equal(new SchemeString('SchemeSymbol'));
                expect(bif(new SchemeCons(new SchemeUserDefinedFunction(), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeString('SchemeUserDefinedFunction'));
                expect(bif(new SchemeCons(new SchemeBuiltinFunction(), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeString('SchemeBuiltinFunction'));
            });
        });
    });

    it('should have a `SchemeBuiltinFunctionIf` function', function () {
        expect(builtinFunctions).to.have.a.property('SchemeBuiltinFunctionIf');
        expect(builtinFunctions.SchemeBuiltinFunctionIf).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionIf.isSchemeBuiltinFunction).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionIf.symbol).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionIf.symbol.equals(new SchemeSymbol('if'))).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionIf.operation).to.be.a('function');


        describe('.SchemeBuiltinFunctionIf()', function () {
            it('should return the evaluated then, if the argument isn\'t false', function () {
                var t = new SchemeString('yepp');
                var f = new SchemeString('nope');

                expect(builtinFunctions.SchemeBuiltinFunctionIf.operation(new SchemeCons(new SchemeString('hi'), new SchemeCons(t, new SchemeCons(f, new SchemeNil()))), evaluator.environment, evaluator)).to.deep.equal(t);
                expect(builtinFunctions.SchemeBuiltinFunctionIf.operation(new SchemeCons(new SchemeNumber(1), new SchemeCons(t, new SchemeCons(f, new SchemeNil()))), evaluator.environment, evaluator)).to.deep.equal(t);
                expect(builtinFunctions.SchemeBuiltinFunctionIf.operation(new SchemeCons(new SchemeTrue(), new SchemeCons(t, new SchemeCons(f, new SchemeNil()))), evaluator.environment, evaluator)).to.deep.equal(t);
                expect(builtinFunctions.SchemeBuiltinFunctionIf.operation(new SchemeCons(new SchemeSymbol('hi'), new SchemeCons(t, new SchemeCons(f, new SchemeNil()))), evaluator.environment, evaluator)).to.deep.equal(t);
                expect(builtinFunctions.SchemeBuiltinFunctionIf.operation(new SchemeCons(new SchemeNil(), new SchemeCons(t, new SchemeCons(f, new SchemeNil()))), evaluator.environment, evaluator)).to.deep.equal(t);
                expect(builtinFunctions.SchemeBuiltinFunctionIf.operation(new SchemeCons(new SchemeCons(new SchemeSymbol('cons'), new SchemeCons(new SchemeNumber(1), new SchemeNil())), new SchemeCons(t, new SchemeCons(f, new SchemeNil()))), evaluator.environment, evaluator)).to.deep.equal(t);
            });

            it('should return the evaluated else, if the argument is false', function () {
                var t = new SchemeString('yepp');
                var f = new SchemeString('nope');

                expect(builtinFunctions.SchemeBuiltinFunctionIf.operation(new SchemeCons(new SchemeFalse(), new SchemeCons(t, new SchemeCons(f, new SchemeNil()))), evaluator.environment, evaluator)).to.deep.equal(f);
            });

            it('should evaluate the arguments', function () {
                var t = new SchemeString('yepp');
                var f = new SchemeSymbol('dummyIf');
                var val = new SchemeString('muh');

                evaluator.environment.addBindingFor(f, val);
                expect(builtinFunctions.SchemeBuiltinFunctionIf.operation(new SchemeCons(new SchemeFalse(), new SchemeCons(t, new SchemeCons(f, new SchemeNil()))), evaluator.environment, evaluator)).to.deep.equal(val);
            });
        });
    });

    it('should have a `SchemeBuiltinFunctionNot` function', function () {
        expect(builtinFunctions).to.have.a.property('SchemeBuiltinFunctionNot');
        expect(builtinFunctions.SchemeBuiltinFunctionNot).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionNot.isSchemeBuiltinFunction).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionNot.symbol).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionNot.symbol.equals(new SchemeSymbol('not'))).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionNot.operation).to.be.a('function');


        describe('.SchemeBuiltinFunctionNot()', function () {
            it('should return false, if the argument isn\'t false', function () {
                expect(builtinFunctions.SchemeBuiltinFunctionNot.operation(new SchemeCons(new SchemeString('hi'), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
                expect(builtinFunctions.SchemeBuiltinFunctionNot.operation(new SchemeCons(new SchemeNumber(1), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
                expect(builtinFunctions.SchemeBuiltinFunctionNot.operation(new SchemeCons(new SchemeTrue(), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
                expect(builtinFunctions.SchemeBuiltinFunctionNot.operation(new SchemeCons(new SchemeSymbol('hi'), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
                expect(builtinFunctions.SchemeBuiltinFunctionNot.operation(new SchemeCons(new SchemeNil(), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
                expect(builtinFunctions.SchemeBuiltinFunctionNot.operation(new SchemeCons(new SchemeCons(new SchemeSymbol('cons'), new SchemeCons(new SchemeNumber(1), new SchemeNil())), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
            });

            it('should return true, if the argument is false', function () {
                expect(builtinFunctions.SchemeBuiltinFunctionNot.operation(new SchemeCons(new SchemeFalse(), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeTrue());
            });

            it('should evaluate the arguments', function () {
                var sym = new SchemeSymbol('dummyNot');
                var val = new SchemeFalse();

                evaluator.environment.addBindingFor(sym, val);

                expect(builtinFunctions.SchemeBuiltinFunctionNot.operation(new SchemeCons(sym, new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeTrue());
            });
        });
    });

    it('should have a `SchemeBuiltinFunctionAnd` function', function () {
        expect(builtinFunctions).to.have.a.property('SchemeBuiltinFunctionAnd');
        expect(builtinFunctions.SchemeBuiltinFunctionAnd).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionAnd.isSchemeBuiltinFunction).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionAnd.symbol).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionAnd.symbol.equals(new SchemeSymbol('and'))).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionAnd.operation).to.be.a('function');


        describe('.SchemeBuiltinFunctionAnd()', function () {
            it('should return the last value if nothing is false', function () {
                expect(builtinFunctions.SchemeBuiltinFunctionAnd.operation(new SchemeCons(new SchemeString('Yepp'), new SchemeCons(new SchemeString('2nd'), new SchemeCons(new SchemeNumber(2), new SchemeNil()))), evaluator.environment, evaluator)).to.deep.equal(new SchemeNumber(2));
                expect(builtinFunctions.SchemeBuiltinFunctionAnd.operation(new SchemeCons(new SchemeFalse(), new SchemeCons(new SchemeString('2nd'), new SchemeCons(new SchemeNumber(2), new SchemeNil()))), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
                expect(builtinFunctions.SchemeBuiltinFunctionAnd.operation(new SchemeCons(new SchemeTrue(), new SchemeCons(new SchemeFalse(), new SchemeCons(new SchemeNumber(2), new SchemeNil()))), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
            });

            it('should return the last evaluated value if nothing is false', function () {
                var sym = new SchemeSymbol('dummyAnd');
                var val = new SchemeString('Yippy');

                evaluator.environment.addBindingFor(sym, val);
                expect(builtinFunctions.SchemeBuiltinFunctionAnd.operation(new SchemeCons(new SchemeTrue(), new SchemeCons(new SchemeString('2nd'), new SchemeCons(sym, new SchemeNil()))), evaluator.environment, evaluator)).to.deep.equal(val);
            });
        });
    });

    it('should have a `SchemeBuiltinFunctionOr` function', function () {
        expect(builtinFunctions).to.have.a.property('SchemeBuiltinFunctionOr');
        expect(builtinFunctions.SchemeBuiltinFunctionOr).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionOr.isSchemeBuiltinFunction).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionOr.symbol).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionOr.symbol.equals(new SchemeSymbol('or'))).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionOr.operation).to.be.a('function');


        describe('.SchemeBuiltinFunctionOr()', function () {
            it('should return the first non-false result', function () {
                expect(builtinFunctions.SchemeBuiltinFunctionOr.operation(new SchemeCons(new SchemeString('Yepp'), new SchemeCons(new SchemeString('2nd'), new SchemeCons(new SchemeNumber(2), new SchemeNil()))), evaluator.environment, evaluator)).to.deep.equal(new SchemeString('Yepp'));
                expect(builtinFunctions.SchemeBuiltinFunctionOr.operation(new SchemeCons(new SchemeFalse(), new SchemeCons(new SchemeString('2nd'), new SchemeCons(new SchemeNumber(2), new SchemeNil()))), evaluator.environment, evaluator)).to.deep.equal(new SchemeString('2nd'));
                expect(builtinFunctions.SchemeBuiltinFunctionOr.operation(new SchemeCons(new SchemeFalse(), new SchemeCons(new SchemeFalse(), new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(new SchemeFalse());
            });

            it('should return the first evaluated non-false result', function () {
                var sym = new SchemeSymbol('dummyOr');
                var val = new SchemeString('Yippy');

                evaluator.environment.addBindingFor(sym, val);
                expect(builtinFunctions.SchemeBuiltinFunctionOr.operation(new SchemeCons(sym, new SchemeCons(new SchemeString('2nd'), new SchemeCons(new SchemeNumber(2), new SchemeNil()))), evaluator.environment, evaluator)).to.deep.equal(val);
            });
        });
    });

    it('should have a `SchemeBuiltinFunctionQuote` function', function () {
        expect(builtinFunctions).to.have.a.property('SchemeBuiltinFunctionQuote');
        expect(builtinFunctions.SchemeBuiltinFunctionQuote).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionQuote.isSchemeBuiltinFunction).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionQuote.symbol).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionQuote.symbol.equals(new SchemeSymbol('quote'))).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionQuote.operation).to.be.a('function');


        describe('.SchemeBuiltinFunctionQuote()', function () {
            it('should return the unevaluated input', function () {
                var sym = new SchemeSymbol('dummyQuote');
                evaluator.environment.addBindingFor(sym, new SchemeNumber(1));
                expect(builtinFunctions.SchemeBuiltinFunctionQuote.operation(new SchemeCons(sym, new SchemeNil()))).to.deep.equal(sym);
            });
        });
    });

    it('should have a `SchemeBuiltinFunctionBegin` function', function () {
        expect(builtinFunctions).to.have.a.property('SchemeBuiltinFunctionBegin');
        expect(builtinFunctions.SchemeBuiltinFunctionBegin).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionBegin.isSchemeBuiltinFunction).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionBegin.symbol).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionBegin.symbol.equals(new SchemeSymbol('begin'))).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionBegin.operation).to.be.a('function');


        describe('.SchemeBuiltinFunctionBegin()', function () {
            it('should evaluate everything and return the last result', function () {
                expect(builtinFunctions.SchemeBuiltinFunctionBegin.operation(
                    new SchemeCons(
                        new SchemeCons(new SchemeSymbol('display'), new SchemeCons(new SchemeString('hello world'), new SchemeNil())),
                        new SchemeCons(new SchemeCons(new SchemeSymbol('+'), new SchemeCons(new SchemeNumber(1), new SchemeCons(new SchemeNumber(2), new SchemeNil()))), new SchemeNil())
                    ),
                    evaluator.environment, evaluator
                )).to.deep.equal(new SchemeNumber(3));

                expect(builtinFunctions.SchemeBuiltinFunctionBegin.operation(
                    new SchemeCons(
                        new SchemeCons(new SchemeSymbol('display'), new SchemeCons(new SchemeString('hello world'), new SchemeNil())),
                        new SchemeCons(
                            new SchemeCons(new SchemeSymbol('+'), new SchemeCons(new SchemeNumber(1), new SchemeCons(new SchemeNumber(2), new SchemeNil()))),
                            new SchemeCons(new SchemeSymbol('display'), new SchemeCons(new SchemeString('yippy'), new SchemeNil()))
                            )
                    ),
                    evaluator.environment, evaluator
                )).to.deep.equal(new SchemeString('yippy'));
            });
        });
    });

    it('should have a `SchemeBuiltinFunctionSet` function', function () {
        expect(builtinFunctions).to.have.a.property('SchemeBuiltinFunctionSet');
        expect(builtinFunctions.SchemeBuiltinFunctionSet).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionSet.isSchemeBuiltinFunction).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionSet.symbol).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionSet.symbol.equals(new SchemeSymbol('set!'))).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionSet.operation).to.be.a('function');


        describe('.SchemeBuiltinFunctionSet()', function () {
            it('should set a value to an existing key', function () {
                var sym = new SchemeSymbol('dummySet');
                var newVal = new SchemeNumber(5);

                evaluator.environment.addBindingFor(sym, new SchemeNumber(123));
                expect(builtinFunctions.SchemeBuiltinFunctionSet.operation(new SchemeCons(sym, new SchemeCons(newVal, new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(newVal);
                expect(evaluator.environment.getBindingFor(sym)).to.deep.equal(newVal);
            });

            it('should set an evaluated value to an existing key', function () {
                var sym = new SchemeSymbol('dummySet2');
                var newVal = new SchemeSymbol('evalMe');
                var newValVal = new SchemeNumber(555);

                evaluator.environment.addBindingFor(sym, new SchemeNumber(123));
                evaluator.environment.addBindingFor(newVal, newValVal);
                expect(builtinFunctions.SchemeBuiltinFunctionSet.operation(new SchemeCons(sym, new SchemeCons(newVal, new SchemeNil())), evaluator.environment, evaluator)).to.deep.equal(newValVal);
                expect(evaluator.environment.getBindingFor(sym)).to.deep.equal(newValVal);
            });

            it('should throw an error, if the argument is not a symbol', function () {
                var sym = new SchemeString('dummySetUndefined');

                expect(builtinFunctions.SchemeBuiltinFunctionSet.operation.bind(builtinFunctions.SchemeBuiltinFunctionSet.operation, new SchemeCons(sym, new SchemeCons(new SchemeNumber(1), new SchemeNil())), evaluator.environment, evaluator)).to.throw('(set!): argument is not a symbol!');
            });

            it('should throw an error, if the binding doesn\'t exist', function () {
                var sym = new SchemeSymbol('dummySetUndefined');
                var newVal = new SchemeNumber(5);

                expect(builtinFunctions.SchemeBuiltinFunctionSet.operation.bind(builtinFunctions.SchemeBuiltinFunctionSet.operation, new SchemeCons(sym, new SchemeCons(newVal, new SchemeNil())), evaluator.environment, evaluator)).to.throw('(set!): `<dummySetUndefined>` is not defined and therefore cannot be set to `5`.');
            });
        });
    });

    it('should have a `SchemeBuiltinFunctionSetCar` function', function () {
        expect(builtinFunctions).to.have.a.property('SchemeBuiltinFunctionSetCar');
        expect(builtinFunctions.SchemeBuiltinFunctionSetCar).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionSetCar.isSchemeBuiltinFunction).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionSetCar.symbol).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionSetCar.symbol.equals(new SchemeSymbol('set-car!'))).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionSetCar.operation).to.be.a('function');


        describe('.SchemeBuiltinFunctionSetCar()', function () {
            it('should change the car to a new value', function () {
                var cons = new SchemeCons(new SchemeCons(new SchemeSymbol('cons'), new SchemeCons(new SchemeNumber(1), new SchemeCons(new SchemeNumber(2), new SchemeNil()))), new SchemeCons(new SchemeNumber(3), new SchemeNil()));
                expect(builtinFunctions.SchemeBuiltinFunctionSetCar.operation(cons, evaluator.environment, evaluator)).to.deep.equal(new SchemeCons(new SchemeNumber(3), new SchemeNumber(2)));
            });

            it('should throw an error, if the argument isn\'t a cons', function () {
                var cons = new SchemeCons(new SchemeNumber(1), new SchemeNil());
                expect(builtinFunctions.SchemeBuiltinFunctionSetCar.operation.bind(builtinFunctions.SchemeBuiltinFunctionSetCar.operation, cons, evaluator.environment, evaluator)).to.throw('(set-car!): argument is not a cons!');
            });
        });
    });

    it('should have a `SchemeBuiltinFunctionSetCdr` function', function () {
        expect(builtinFunctions).to.have.a.property('SchemeBuiltinFunctionSetCdr');
        expect(builtinFunctions.SchemeBuiltinFunctionSetCdr).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionSetCdr.isSchemeBuiltinFunction).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionSetCdr.symbol).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionSetCdr.symbol.equals(new SchemeSymbol('set-cdr!'))).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionSetCdr.operation).to.be.a('function');


        describe('.SchemeBuiltinFunctionSetCdr()', function () {
            it('should change the cdr to a new value', function () {
                var cons = new SchemeCons(new SchemeCons(new SchemeSymbol('cons'), new SchemeCons(new SchemeNumber(1), new SchemeCons(new SchemeNumber(2), new SchemeNil()))), new SchemeCons(new SchemeNumber(3), new SchemeNil()));
                expect(builtinFunctions.SchemeBuiltinFunctionSetCdr.operation(cons, evaluator.environment, evaluator)).to.deep.equal(new SchemeCons(new SchemeNumber(1), new SchemeNumber(3)));
            });

            it('should throw an error, if the argument isn\'t a cons', function () {
                var cons = new SchemeCons(new SchemeNumber(1), new SchemeNil());
                expect(builtinFunctions.SchemeBuiltinFunctionSetCdr.operation.bind(builtinFunctions.SchemeBuiltinFunctionSetCar.operation, cons, evaluator.environment, evaluator)).to.throw('(set-cdr!): argument is not a cons!');
            });
        });
    });

    it('should have a `SchemeBuiltinFunctionLet` function', function () {
        expect(builtinFunctions).to.have.a.property('SchemeBuiltinFunctionLet');
        expect(builtinFunctions.SchemeBuiltinFunctionLet).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionLet.isSchemeBuiltinFunction).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionLet.symbol).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionLet.symbol.equals(new SchemeSymbol('let'))).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionLet.operation).to.be.a('function');


        describe('.SchemeBuiltinFunctionLet()', function () {
            it('should evaluate stuff in an temp environment', function () {
                var key = new SchemeSymbol('dummyLet');
                var val = new SchemeNumber(42);
                var outerKey = new SchemeSymbol('dummyLetO');
                var outerVal = new SchemeNumber(13);

                evaluator.environment.addBindingFor(outerKey, outerVal);

                expect(evaluator.environment.getBindingFor(key)).to.deep.equal(new SchemeNil());
                expect(builtinFunctions.SchemeBuiltinFunctionLet.operation(
                    new SchemeCons(
                        new SchemeCons(
                            new SchemeCons(key, new SchemeCons(val, new SchemeNil()), new SchemeNil()),
                            new SchemeNil()
                        ),
                        new SchemeCons(
                            new SchemeCons(new SchemeSymbol('+'), new SchemeCons(new SchemeSymbol('dummyLet'), new SchemeCons(new SchemeSymbol('dummyLetO'), new SchemeNil())))
                        )
                    ),
                    evaluator.environment, evaluator
                )).to.deep.equal(new SchemeNumber(55));
                expect(evaluator.environment.getBindingFor(key)).to.deep.equal(new SchemeNil());
            });
        });
    });

    it('should have a `SchemeBuiltinFunctionLambda` function', function () {
        expect(builtinFunctions).to.have.a.property('SchemeBuiltinFunctionLambda');
        expect(builtinFunctions.SchemeBuiltinFunctionLambda).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionLambda.isSchemeBuiltinFunction).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionLambda.symbol).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionLambda.symbol.equals(new SchemeSymbol('lambda'))).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionLambda.operation).to.be.a('function');


        describe('.SchemeBuiltinFunctionLambda()', function () {
            it('should return a new user-defined-function', function () {
                var args = new SchemeCons(new SchemeSymbol('x'), new SchemeNil());
                var body = new SchemeCons(
                            new SchemeSymbol('+'), 
                            new SchemeCons(
                                new SchemeNumber(1), 
                                new SchemeCons(
                                    new SchemeNumber(2),
                                    new SchemeNil()
                                )
                            )
                        );
                var result = builtinFunctions.SchemeBuiltinFunctionLambda.operation(
                    new SchemeCons(
                        args,
                        body
                   ), evaluator.environment, evaluator);

                expect(result.toString()).to.equal('<user-defined-function>');
                expect(result.args).to.deep.equal(args);
                expect(result.bodyList).to.deep.equal(new SchemeCons(new SchemeSymbol('begin'), body));
                expect(result.environment).to.deep.equal(evaluator.environment);
            });
        });
    });

    it('should have a `SchemeBuiltinFunctionError` function', function () {
        expect(builtinFunctions).to.have.a.property('SchemeBuiltinFunctionError');
        expect(builtinFunctions.SchemeBuiltinFunctionError).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionError.isSchemeBuiltinFunction).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionError.symbol).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionError.symbol.equals(new SchemeSymbol('error'))).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionError.operation).to.be.a('function');


        describe('.SchemeBuiltinFunctionError()', function () {
            it('should throw an error', function () {
                expect(builtinFunctions.SchemeBuiltinFunctionError.operation.bind(builtinFunctions.SchemeBuiltinFunctionError.operation, new SchemeCons(new SchemeString('Hi'), new SchemeNil()), evaluator.environment, evaluator)).to.throw('Hi');
            });

            it('should throw an error, if the argument isn\'t a string', function () {
                expect(builtinFunctions.SchemeBuiltinFunctionError.operation.bind(builtinFunctions.SchemeBuiltinFunctionError.operation, new SchemeCons(new SchemeNumber(1), new SchemeNil()), evaluator.environment, evaluator)).to.throw('(error): argument is not a string!');
            });
        });
    });

    it('should have a `SchemeBuiltinFunctionLoad` function', function () {
        expect(builtinFunctions).to.have.a.property('SchemeBuiltinFunctionLoad');
        expect(builtinFunctions.SchemeBuiltinFunctionLoad).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionLoad.isSchemeBuiltinFunction).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionLoad.symbol).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionLoad.symbol.equals(new SchemeSymbol('load'))).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionLoad.operation).to.be.a('function');


        describe('.SchemeBuiltinFunctionLoad()', function () {
            it('should load and evaluate a file', function () {
                expect(evaluator.environment.getBindingFor(new SchemeSymbol('dummyLoad'))).to.deep.equal(new SchemeNil());
                expect(builtinFunctions.SchemeBuiltinFunctionLoad.operation(new SchemeCons(new SchemeString('test/mock.lsp'), new SchemeNil()), evaluator.environment, evaluator)).to.deep.equal(new SchemeNumber(2014));
                expect(evaluator.environment.getBindingFor(new SchemeSymbol('dummyLoad'))).to.deep.equal(new SchemeNumber(2014));
            });

            it('should throw an error, if the argument isn\'t a string', function () {
                expect(builtinFunctions.SchemeBuiltinFunctionLoad.operation.bind(builtinFunctions.SchemeBuiltinFunctionLoad.operation, new SchemeCons(new SchemeNumber(1), new SchemeNil()), evaluator.environment, evaluator)).to.throw('(load): argument is not a string!');
            });

            it('should throw an error, if the file canot be read', function () {
                expect(builtinFunctions.SchemeBuiltinFunctionLoad.operation.bind(builtinFunctions.SchemeBuiltinFunctionLoad.operation, new SchemeCons(new SchemeString('/undefined/gibtsjagarnicht.lsp'), new SchemeNil()), evaluator.environment, evaluator)).to.throw('(load): (readFile): `/undefined/gibtsjagarnicht.lsp` is not a file');

                // Wir sperren einfach mal die Datei - damit ist sie da (fileExists, aber nicht lesbar)
                fs.chmodSync('test/no-access', 0);
                expect(builtinFunctions.SchemeBuiltinFunctionLoad.operation.bind(builtinFunctions.SchemeBuiltinFunctionLoad.operation, new SchemeCons(new SchemeString('test/no-access'), new SchemeNil()), evaluator.environment, evaluator)).to.throw('(load): (readFile): error reading `'+ __dirname +'/no-access`! (Error: EACCES, permission denied \''+ __dirname +'/no-access\')');
                fs.chmodSync('test/no-access', 0644);               
            });
        });
    });

    it('should have a `SchemeBuiltinFunctionDebug` function', function () {
        expect(builtinFunctions).to.have.a.property('SchemeBuiltinFunctionDebug');
        expect(builtinFunctions.SchemeBuiltinFunctionDebug).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionDebug.isSchemeBuiltinFunction).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionDebug.symbol).to.be.an('object');
        expect(builtinFunctions.SchemeBuiltinFunctionDebug.symbol.equals(new SchemeSymbol('debug'))).to.be.true;
        expect(builtinFunctions.SchemeBuiltinFunctionDebug.operation).to.be.a('function');


        describe('.SchemeBuiltinFunctionDebug()', function () {
            it('should return the environment', function () {
                expect(builtinFunctions.SchemeBuiltinFunctionDebug.operation(new SchemeNil(), evaluator.environment, evaluator)).to.deep.equal(evaluator.environment);
            });
        });
    });


});
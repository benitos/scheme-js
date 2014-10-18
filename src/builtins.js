var path = require('path');

var SchemeBuiltinFunction     = require('./objects/builtinfunction'),
    SchemeUserDefinedFunction = require('./objects/userdefinedfunction'),
    SchemeEnvironment   = require('./objects/environment'),
    SchemeEvaluator     = require('./evaluator'),
    SchemeCons       = require('./objects/cons'),
    SchemeNumber     = require('./objects/number'),
    SchemeNil        = require('./objects/nil'),
    SchemeVoid       = require('./objects/void'),
    SchemeString     = require('./objects/string'),
    SchemeSymbol     = require('./objects/symbol'),
    SchemeTrue       = require('./objects/true'),
    SchemeFalse      = require('./objects/false'),
    SchemeReaderFile = require('./reader.file');


/**
 * Builtin Functions
 * Beschreibungen zu den Funktionen können (falls nötig) der Readme.md entnommen werden
 */


/** Display */
module.exports.SchemeBuiltinFunctionDisplay = new SchemeBuiltinFunction('display', function (args, env, evaluator) {
    var msg = evaluator.eval(args.car, env);

    return msg;
});

/** Plus */
module.exports.SchemeBuiltinFunctionPlus = new SchemeBuiltinFunction('+', function (args, env, evaluator) {
    var arg = evaluator.eval(args.car, env);

    // Abbrechen, wenn keine Zahl
    if (!arg.isSchemeNumber) {
        throw '(+): argument is not a number';
    }

    // Ende
    if (arg && args.cdr.isSchemeNil) {
        return arg;
    }

    return new SchemeNumber(arg.value + this.operation(args.cdr, env, evaluator).value);
});


/** Minus */
module.exports.SchemeBuiltinFunctionMinus = new SchemeBuiltinFunction('-', function (args, env, evaluator) {
    var arg = evaluator.eval(args.car, env),
        l2rResult;

    // Abbrechen, wenn keine Zahl
    if (!arg.isSchemeNumber) {
        throw '(-): argument is not a number';
    }
    // Ende
    if (args.cdr.isSchemeNil) {
        return new SchemeNumber(-arg.value);
    }

    // Berechne l2r
    try {
        l2rResult = module.exports.SchemeBuiltinFunctionPlus.operation(args.cdr, env, evaluator);
    } catch (error) {
        throw '(-): l2r - ' + error;
    }

    //return new SchemeNumber(arg.value - this.operation(args.cdr, env, evaluator).value);
    return new SchemeNumber(arg.value - l2rResult.value);
});

/** Multiply */
module.exports.SchemeBuiltinFunctionMultiply = new SchemeBuiltinFunction('*', function (args, env, evaluator) {
    var arg = evaluator.eval(args.car, env);

    // Abbrechen, wenn keine Zahl
    if(!arg.isSchemeNumber) {
        throw '(*): argument is not a number';
    }
    // Ende
    if(arg && args.cdr.isSchemeNil) {
        return arg;
    }

    return new SchemeNumber(arg.value * this.operation(args.cdr, env, evaluator).value);
});

/** Divide */
module.exports.SchemeBuiltinFunctionDivide = new SchemeBuiltinFunction('/', function (args, env, evaluator) {
    var arg = evaluator.eval(args.car, env),
        l2rResult;

    // Abbrechen, wenn keine Zahl
    if(!arg.isSchemeNumber) {
        throw '(/): argument is not a number';
    }

    // Ende (Rekursion)
    if(arg && args.cdr.isSchemeNil) {
        return arg;
    }

    // Berechne l2r
    try {
        l2rResult = module.exports.SchemeBuiltinFunctionMultiply.operation(args.cdr, env, evaluator);
    } catch (error) {
        throw '(/): l2r - ' + error;
    }

    // Durch 0
    if (arg.value === 0 || l2rResult.value === 0) {
        throw '(/): division by zero';
    }

    return new SchemeNumber(arg.value / l2rResult.value);

    // return new SchemeNumber(arg.value / this.operation(args.cdr, env, evaluator).value); = right-to-left = falsches Ergebnis :)
});

/** Define */
module.exports.SchemeBuiltinFunctionDefine = new SchemeBuiltinFunction('define', function (args, env, evaluator) {
    var bodyList,
        definedBinding,
        unevaluatedArgs,
        fncName,
        result = new SchemeNil(),
        varOrFnc = args.car,
        varOrFncName = varOrFnc.isSchemeCons ? varOrFnc.car : varOrFnc;


    // Error
    if (!varOrFnc || (!varOrFnc.isSchemeCons && !varOrFnc.isSchemeSymbol)) {
        throw '(define): argument is not a symbol or cons!';
    }


    // Bereits vorhanden?
    // Nur im lokalen Env nachsehen, ansonsten in akt. Scope neu definieren
    definedBinding = env.getBindingFor(varOrFncName, true);

    // Symbol
    if (varOrFnc.isSchemeSymbol) {
        result = evaluator.eval(args.cdr.car, env);
    }
    // Function
    else if (varOrFnc.isSchemeCons) {
        fncName = varOrFnc.car;
        unevaluatedArgs = varOrFnc.cdr;
        bodyList = args.cdr;

        result = new SchemeUserDefinedFunction(unevaluatedArgs, bodyList, env);
    }

    // Hier ist fraglich, wie mit bereits definierten Variablen umgegangen werden soll
    // Laut "diesem Internet" obliegt es der Implementation, ueber die Verwendung
    // von multiplen define-Statements für das selbe Symbol zu entscheiden.
    // Daher hier alternative Optionen im Kommentar:
    // Und da DrRacket nachtraegliche Veraenderungen erlaubt, tut scheme.js dies auch :)
    if(!definedBinding.isSchemeNil) {
        // throw '(define): `'+ varOrFncName.toString() +'` is already defined within this scope';
        // return definedBinding;
        env.changeBindingFor(varOrFncName, result);
    } else {
        env.addBindingFor(varOrFncName, result);
    }

    return result;
});


/** Cons */
module.exports.SchemeBuiltinFunctionCons = new SchemeBuiltinFunction('cons', function (args, env, evaluator) {
    return new SchemeCons(evaluator.eval(args.car, env), evaluator.eval(args.second(), env));
});

/** List */
// List vs Cons: http://www.htdp.org/2003-09-26/Book/curriculum-Z-H-17.html#node_idx_1024
module.exports.SchemeBuiltinFunctionList = new SchemeBuiltinFunction('list', function (args, env, evaluator) {
    var arg = evaluator.eval(args.car, env);

    // Ende
    if (arg && args.cdr.isSchemeNil) {
        return new SchemeCons(evaluator.eval(args.car, env), new SchemeNil());
    }

    return new SchemeCons(evaluator.eval(args.car, env), this.operation(args.cdr, env, evaluator));
});


/** Car */
module.exports.SchemeBuiltinFunctionCar = new SchemeBuiltinFunction('car', function (args, env, evaluator) {
    var result = evaluator.eval(args.car, env);

    // Abbrechen, wenn kein Cons
    if (!result.isSchemeCons) {
        throw '(car): argument is not a cons!';
    }

    return result.car;
});

/** Cdr */
module.exports.SchemeBuiltinFunctionCdr = new SchemeBuiltinFunction('cdr', function (args, env, evaluator) {
    var result = evaluator.eval(args.car, env);

    // Abbrechen, wenn kein Cons
    if (!result.isSchemeCons) {
        throw '(cdr): argument is not a cons!';
    }

    return result.cdr;
});

/** = : Vergleich 2er Zahlen */
// http://stackoverflow.com/questions/16299246/what-is-the-difference-between-eq-eqv-equal-and-in-scheme
module.exports.SchemeBuiltinFunctionIsEqSign = new SchemeBuiltinFunction('=', function (args, env, evaluator) {
    var a = evaluator.eval(args.car, env),
        b = evaluator.eval(args.second(), env);

    // Abbrechen, wenn keine Zahl
    if(!a.isSchemeNumber || !b.isSchemeNumber) {
        throw '(=): argument is not a number!';
    }
    // Ende
    if(a && args.cdr.cdr.isSchemeNil) {
        return a.value === b.value ? new SchemeTrue() : new SchemeFalse();
    }

    return ((a.value === b.value) && this.operation(args.cdr, env, evaluator).isSchemeTrue) ? new SchemeTrue() : new SchemeFalse();
});

/** LowerThan */
module.exports.SchemeBuiltinFunctionLowerThan = new SchemeBuiltinFunction('<', function (args, env, evaluator) {
    var a = evaluator.eval(args.car, env),
        b = evaluator.eval(args.second(), env);

    // Abbrechen, wenn keine Zahl
    if(!a.isSchemeNumber || !b.isSchemeNumber) {
        throw '(<): argument is not a number!';
    }
    // Ende
    if(a && args.cdr.cdr.isSchemeNil) {
        return a.value < b.value ? new SchemeTrue() : new SchemeFalse();
    }

    return ((a.value < b.value) && this.operation(args.cdr, env, evaluator).isSchemeTrue) ? new SchemeTrue() : new SchemeFalse();
});

/** LowerThanEqual */
module.exports.SchemeBuiltinFunctionLowerThanEqual = new SchemeBuiltinFunction('<=', function (args, env, evaluator) {
    var a = evaluator.eval(args.car, env),
        b = evaluator.eval(args.second(), env);

    // Abbrechen, wenn keine Zahl
    if(!a.isSchemeNumber || !b.isSchemeNumber) {
        throw '(<=): argument is not a number!';
    }
    // Ende
    if(a && args.cdr.cdr.isSchemeNil) {
        return a.value <= b.value ? new SchemeTrue() : new SchemeFalse();
    }

    return ((a.value <= b.value) && this.operation(args.cdr, env, evaluator).isSchemeTrue) ? new SchemeTrue() : new SchemeFalse();
});

/** GreaterThan */
module.exports.SchemeBuiltinFunctionGreaterThan = new SchemeBuiltinFunction('>', function (args, env, evaluator) {
    var a = evaluator.eval(args.car, env),
        b = evaluator.eval(args.second(), env);

    // Abbrechen, wenn keine Zahl
    if(!a.isSchemeNumber || !b.isSchemeNumber) {
        throw '(>): argument is not a number!';
    }
    // Ende
    if(a && args.cdr.cdr.isSchemeNil) {
        return a.value > b.value ? new SchemeTrue() : new SchemeFalse();
    }

    return ((a.value > b.value) && this.operation(args.cdr, env, evaluator).isSchemeTrue) ? new SchemeTrue() : new SchemeFalse();
});

/** GreaterThanEqual */
module.exports.SchemeBuiltinFunctionGreaterThanEqual = new SchemeBuiltinFunction('>=', function (args, env, evaluator) {
    var a = evaluator.eval(args.car, env),
        b = evaluator.eval(args.second(), env);

    // Abbrechen, wenn keine Zahl
    if(!a.isSchemeNumber || !b.isSchemeNumber) {
        throw '(>=): argument is not a number!';
    }
    // Ende
    if(a && args.cdr.cdr.isSchemeNil) {
        return a.value >= b.value ? new SchemeTrue() : new SchemeFalse();
    }

    return ((a.value >= b.value) && this.operation(args.cdr, env, evaluator).isSchemeTrue) ? new SchemeTrue() : new SchemeFalse();
});

/** Eq?: selbes Objekt im Speicher
 * http://stackoverflow.com/questions/17550672/scheme-eq-eqv-equal-difference
 * https://groups.csail.mit.edu/mac/ftpdir/scheme-7.4/doc-html/scheme_4.html
 */
module.exports.SchemeBuiltinFunctionIsEq = new SchemeBuiltinFunction('eq?', function (args, env, evaluator) {
    var a = evaluator.eval(args.car, env), b = evaluator.eval(args.second(), env);
    return a === b ? new SchemeTrue() : new SchemeFalse();
});

/** Eqv? 
 * "Two values are eqv? if and only if they are eq?, 
 *  unless otherwise specified for a particular datatype. 
 *  The number and character datatypes are the only ones 
 *  for which eqv? differs from eq?" 
 * (http://stackoverflow.com/questions/17550672/scheme-eq-eqv-equal-difference)
 * https://groups.csail.mit.edu/mac/ftpdir/scheme-7.4/doc-html/scheme_4.html
 */
module.exports.SchemeBuiltinFunctionIsEqv = new SchemeBuiltinFunction('eqv?', function (args, env, evaluator) {
    var a = evaluator.eval(args.car, env), b = evaluator.eval(args.second(), env);
    return ((a === b)  || ((a.getType() === 'SchemeString' || a.getType() === 'SchemeNumber') && a.equals(b))) ? new SchemeTrue() : new SchemeFalse();
});

/** Equal? 
 * "A rule of thumb is that objects are generally equal? if they print the same." 
 * (https://groups.csail.mit.edu/mac/ftpdir/scheme-7.4/doc-html/scheme_4.html)
 */
module.exports.SchemeBuiltinFunctionIsEqual = new SchemeBuiltinFunction('equal?', function (args, env, evaluator) {
    var a = evaluator.eval(args.car, env), b = evaluator.eval(args.second(), env);

    return a.toString() === b.toString() ? new SchemeTrue() : new SchemeFalse();
});

/** Boolean? */
module.exports.SchemeBuiltinFunctionIsBoolean = new SchemeBuiltinFunction('boolean?', function (args, env, evaluator) {
    var evaluated = evaluator.eval(args.car, env);

    return (evaluated.isSchemeTrue || evaluated.isSchemeFalse) ? new SchemeTrue() : new SchemeFalse();
});

/** Symbol? */
module.exports.SchemeBuiltinFunctionIsSymbol = new SchemeBuiltinFunction('symbol?', function (args, env, evaluator) {
    var evaluated = evaluator.eval(args.car, env);  // DrRacket scheint Symbole auch zuvor zu evaluieren

    return (evaluated.isSchemeSymbol) ? new SchemeTrue() : new SchemeFalse();
});

/** Number? */
module.exports.SchemeBuiltinFunctionIsNumber = new SchemeBuiltinFunction('number?', function (args, env, evaluator) {
    var evaluated = evaluator.eval(args.car, env);

    return (evaluated.isSchemeNumber) ? new SchemeTrue() : new SchemeFalse();
});

/** String? */
module.exports.SchemeBuiltinFunctionIsString = new SchemeBuiltinFunction('string?', function (args, env, evaluator) {
    var evaluated = evaluator.eval(args.car, env);

    return (evaluated.isSchemeString) ? new SchemeTrue() : new SchemeFalse();
});

/** Cons? */
module.exports.SchemeBuiltinFunctionIsCons = new SchemeBuiltinFunction('cons?', function (args, env, evaluator) {
    var evaluated = evaluator.eval(args.car, env);

    return (evaluated.isSchemeCons) ? new SchemeTrue() : new SchemeFalse();
});

/** Null? */
module.exports.SchemeBuiltinFunctionIsNil = new SchemeBuiltinFunction('null?', function (args, env, evaluator) {
    var evaluated = evaluator.eval(args.car, env);

    return (evaluated.isSchemeNil) ? new SchemeTrue() : new SchemeFalse();
});


/** Type? - nicht SchemeStd */
module.exports.SchemeBuiltinFunctionType = new SchemeBuiltinFunction('type?', function (args, env, evaluator) {
    var evaluated = evaluator.eval(args.car, env);

    return new SchemeString(evaluated.getType());
});

/** If */
module.exports.SchemeBuiltinFunctionIf = new SchemeBuiltinFunction('if', function (args, env, evaluator) {
    var evaluated = evaluator.eval(args.car, env);

    // Scheme convenience - alles was nicht false ist, ist true
    // ftp://ftp.cs.utexas.edu/pub/garbage/cs345/schintro-v14/schintro_19.html#SEC19
    if (evaluated && !evaluated.isSchemeFalse) {
        return evaluator.eval(args.second(), env);
    } else if (evaluated && !args.cdr.cdr.isSchemeNil) {
        return evaluator.eval(args.cdr.second(), env);
    }

    // Evaluation fehlgeschlagen oder kein Else-Statement:
    return new SchemeNil();
});

/** Not */
module.exports.SchemeBuiltinFunctionNot = new SchemeBuiltinFunction('not', function (args, env, evaluator) {
    var evaluated = evaluator.eval(args.car, env);

    // Scheme convenience - alles was nicht false ist, ist true -> und damit hier = false
    // ftp://ftp.cs.utexas.edu/pub/garbage/cs345/schintro-v14/schintro_19.html#SEC19
    if (evaluated && evaluated.isSchemeFalse) {
        return new SchemeTrue();
    }

    // Alles andere ist also false
    return new SchemeFalse();
});

/** And */
module.exports.SchemeBuiltinFunctionAnd = new SchemeBuiltinFunction('and', function (args, env, evaluator) {
    var evaluated = evaluator.eval(args.car, env),
        result;

    // Abbruch, wenn false
    if (evaluated && evaluated.isSchemeFalse) {
        return new SchemeFalse();
    }

    // Ende
    if (evaluated && args.cdr.isSchemeNil) {
        return evaluated;
    }

    // Rekursiv weiterhampeln
    result = this.operation(args.cdr, env, evaluator);
    return (!result.isSchemeFalse ? result : new SchemeFalse());
});

/** Or */
module.exports.SchemeBuiltinFunctionOr = new SchemeBuiltinFunction('or', function (args, env, evaluator) {
    var evaluated = evaluator.eval(args.car, env),
        result;

    // Abbruch, wenn wenn true -> und wegen scheme convenience ist alles, 
    // was nicht false ist = true und damit hier Prüfung auf !false
    // ftp://ftp.cs.utexas.edu/pub/garbage/cs345/schintro-v14/schintro_19.html#SEC19
    if (evaluated && !evaluated.isSchemeFalse) {
        return evaluated;
    }

    // Ende
    if (evaluated && args.cdr.isSchemeNil) {
        return new SchemeFalse();
    }

    // Rekursiv weiterhampeln
    result = this.operation(args.cdr, env, evaluator);
    return (!result.isSchemeFalse ? result : new SchemeFalse());
});

/** Quote */
module.exports.SchemeBuiltinFunctionQuote = new SchemeBuiltinFunction('quote', function (args, env, evaluator) {
    return args.car;
});

/** Begin 
 * https://www.st.cs.uni-saarland.de/edu/config-ss04/scheme-quickref.pdf -> gibt letztes result zurueck
 */
module.exports.SchemeBuiltinFunctionBegin = new SchemeBuiltinFunction('begin', function (args, env, evaluator) {
    var result = new SchemeNil(),
        cdr = args;

    if (!args) { return new SchemeNil(); }

    while(!cdr.isSchemeNil) {
        // result += evaluator.eval(cdr.car, env).toString() + '\n';
        result = evaluator.eval(cdr.car, env);
        cdr = cdr.cdr;
    }

    // return new SchemeString(result);
    return result;
});


/** Set */
module.exports.SchemeBuiltinFunctionSet = new SchemeBuiltinFunction('set!', function (args, env, evaluator) {
    var key = args.car,
        value = evaluator.eval(args.second(), env),
        binding;

    if (!key.isSchemeSymbol) {
        throw '(set!): argument is not a symbol!';
    }

    binding = env.getBindingFor(key);

    if (!binding || binding.isSchemeNil) {
        throw '(set!): `'+ key +'` is not defined and therefore cannot be set to `'+ value +'`.';
    }

    env.changeBindingFor(key, value);

    return value;
});

/** Set-Car */
module.exports.SchemeBuiltinFunctionSetCar = new SchemeBuiltinFunction('set-car!', function (args, env, evaluator) {
    var cons = evaluator.eval(args.car, env),
        value = evaluator.eval(args.second(), env),
        binding;

    if (!cons.isSchemeCons) {
        throw '(set-car!): argument is not a cons!';
    }

    cons.car = value;

    return cons;
});

/** Set-Cdr */
module.exports.SchemeBuiltinFunctionSetCdr = new SchemeBuiltinFunction('set-cdr!', function (args, env, evaluator) {
    var cons = evaluator.eval(args.car, env),
        value = evaluator.eval(args.second(), env),
        binding;

    if (!cons.isSchemeCons) {
        throw '(set-cdr!): argument is not a cons!';
    }

    cons.cdr = value;

    return cons;
});

/** Let */
module.exports.SchemeBuiltinFunctionLet = new SchemeBuiltinFunction('let', function (args, env, evaluator) {
    var tempEnv,
        localBindings,
        currentBinding,
        evaluate;

    tempEnv = new SchemeEnvironment(env);
    localBindings = args.car;
    currentBinding = localBindings.car;

    // Lokale Bindings evaluieren
    while (!localBindings.isSchemeNil) {
        evaluator.eval(
            new SchemeCons(
                new SchemeSymbol('define'),
                new SchemeCons(
                    currentBinding.car,
                    new SchemeCons(currentBinding.second(), new SchemeNil())
                )
            ),
            tempEnv
        );

        localBindings = localBindings.cdr;
        currentBinding = localBindings.car;
    }

    return evaluator.eval(new SchemeCons(new SchemeSymbol('begin'), args.cdr), tempEnv);
});

/** Lambda */
module.exports.SchemeBuiltinFunctionLambda = new SchemeBuiltinFunction('lambda', function (args, env, evaluator) {
    if (!args || (args && args.isSchemeNil))  {
        throw '(lambda): missing argument!';
    }

    if (!args.car.isSchemeCons) {
        throw '(lambda): expected arguments to be a cons!';
    }

    return new SchemeUserDefinedFunction(args.car, args.cdr, env);
});

/** Error */
module.exports.SchemeBuiltinFunctionError = new SchemeBuiltinFunction('error', function (args, env, evaluator) {
    var msg = evaluator.eval(args.car, env);

    if (!msg.isSchemeString) {
        throw '(error): argument is not a string!';
    }

    throw '' + msg.characters;
});

/** Load */
module.exports.SchemeBuiltinFunctionLoad = new SchemeBuiltinFunction('load', function (args, env, evaluator) {
    // Geladen wird ueber Strings
    if (!args.car.isSchemeString) {
        throw '(load): argument is not a string!';
    }

    try {
        return evaluator.eval(new SchemeReaderFile().readFile(args.car.characters), env);
    } catch (error) {
        throw '(load): ' + error;
    }
});



/** Debug */
module.exports.SchemeBuiltinFunctionDebug = new SchemeBuiltinFunction('debug', function (args, env, evaluator) {
    return env;
});


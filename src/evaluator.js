
var SchemeEnvironment = require('./objects/environment'),
    SchemeNil = require('./objects/nil'),
    SchemeTrue = require('./objects/true'),
    SchemeFalse = require('./objects/false'),
    SchemeString = require('./objects/string'),
    SchemeSymbol = require('./objects/symbol');

var builtinFunctions = require('./builtins');

/**
 * Scheme Evaluator
 */
module.exports = (function () {

    /**
     * Der Evaluator
     */
    function SchemeEvaluator () {
        this.init();
    }

    SchemeEvaluator.prototype.environment = null;


    /**
     * Initialisierung
     */
    SchemeEvaluator.prototype.init = function () {
        var key;
        this.environment = new SchemeEnvironment();

        // Alle Builtin-Fncs dem Environment hinzufügen
        for(key in builtinFunctions) {
            var fnc = builtinFunctions[key];

            this.environment.addBindingFor(fnc.symbol, fnc);
        }

        // Reserved words werden schon im Reader abgehandelt
        // this.environment.addBindingFor(new SchemeSymbol('nil'), new SchemeNil());
        // this.environment.addBindingFor(new SchemeSymbol('true'), new SchemeTrue());
        // this.environment.addBindingFor(new SchemeSymbol('#t'), new SchemeTrue());
        // this.environment.addBindingFor(new SchemeSymbol('false'), new SchemeFalse());
        // this.environment.addBindingFor(new SchemeSymbol('#f'), new SchemeFalse());
    };


    /**
     * Evaluiere
     * @param  {SchemeObject} schemeObject      Das zu evaluierende Scheme Objekt
     * @param  {SchemeEnvironment} environment  Das aktuelle Environment
     * @return {Mixed}
     */
    SchemeEvaluator.prototype.eval = function (schemeObject, environment) {
        environment = environment || this.environment;

        if (!schemeObject || !schemeObject.isSchemeObject) {
            throw '(eval): expected a SchemeObject but got a `' + (typeof schemeObject) + '`!';
        }

        // Atome werden nicht evaluiert
        if (schemeObject.isSchemeAtom) {
            // Symbole aber schon
            if (schemeObject.isSchemeSymbol) {
                return environment.getBindingFor(schemeObject);
            }
            return schemeObject;
        }

        // Verarbeite Listen
        if (schemeObject.isSchemeCons) {
            return this.evalCons(schemeObject, environment);
        }

        // zurück, was unbekannt aber ein SchemeObject ist
        return schemeObject;
    };


    /**
     * Evaluieren eine Liste
     * @param  {SchemeObject} schemeObject      Das zu evaluierende Scheme Objekt
     * @param  {SchemeEnvironment} environment  Das aktuelle Environment
     */
    SchemeEvaluator.prototype.evalCons = function (schemeObject, environment) {
        // Falls kein Cons, breche ab
        if (!schemeObject || !schemeObject.isSchemeCons) {
            throw '(evalCons): expected a SchemeCons but got a `' + (typeof schemeObject) + '`!';
        }

        var fncOrSyntax = this.eval(schemeObject.car, environment);

        // Builtin Function
        if (fncOrSyntax.isSchemeBuiltinFunction) {
            return this.evalBuiltinFunction(fncOrSyntax, schemeObject.cdr, environment);
        }

        // User Defined Function
        if (fncOrSyntax.isSchemeUserDefinedFunction) {
            return this.evalUserDefinedFunction(fncOrSyntax, schemeObject.cdr, environment);
        }

        throw '(evalCons): non function in function slot: `' + fncOrSyntax + '`!';

        // Die sanftere Methode: @todo
        // return schemeObject;
    };


    /**
     * Evaluiere eingebaute Funktionen
     */
    SchemeEvaluator.prototype.evalBuiltinFunction = function (fnc, args, environment) {
        // Falls kein Argument, breche ab
        if (!args) {
            throw '(evalBuiltinFunction): expected an argument but got a `' + (typeof args) + '`!';
        }

        // Falls keine Builtin Function, breche ab
        if (!fnc || !fnc.isSchemeBuiltinFunction) {
            throw '(evalBuiltinFunction): argument is not a function (`'+ JSON.stringify(fnc) +'`)!';
        }

        return fnc.operation(args, environment, this);
    };


    /**
     * Benutzerdefinierte Funktionen
     */
    SchemeEvaluator.prototype.evalUserDefinedFunction = function (fnc, args, environment) {
        var bodyList,
            formalArgs,
            unevaluatedArgs,
            newEnv,
            evaluatedArg,
            result;

        // Falls kein Cons, breche ab
        if (!args || !args.isSchemeCons) {
            throw '(evalUserDefinedFunction): expected a SchemeCons but got a `' + (typeof args) + '`!';
        }
        
        formalArgs = fnc.args;
        unevaluatedArgs = args;
        newEnv = new SchemeEnvironment(fnc.environment);

        // Args
        while (!formalArgs.isSchemeNil) {
            // Evaluate
            evaluatedArg = this.eval(unevaluatedArgs.car, environment);

            // Binding für Argument
            newEnv.addBindingFor(formalArgs.car, evaluatedArg);

            // Next ...
            formalArgs = formalArgs.cdr;
            unevaluatedArgs = unevaluatedArgs.cdr;
        }

        // Body
        bodyList = fnc.bodyList;
        result = new SchemeNil();
        while (!bodyList.isSchemeNil) {
            result = this.eval(bodyList.car, newEnv);
            bodyList = bodyList.cdr;
        }

        return result;
    };


    // Energie!
    return SchemeEvaluator;
})();
/**
 * Tests für den Reader
 */

var chai = require('chai'),
    expect = chai.expect,
    fs = require('fs');

var SchemeReaderFile = require('../src/reader.file');
var SchemeReader = require('../src/reader');
var SchemeParser = require('../src/parser');
var SchemeString = require('../src/objects/string');
var SchemeNumber = require('../src/objects/number');
var SchemeSymbol = require('../src/objects/symbol');
var SchemeNil    = require('../src/objects/nil');
var SchemeVoid   = require('../src/objects/void');
var SchemeTrue   = require('../src/objects/true');
var SchemeFalse  = require('../src/objects/false');
var SchemeCons   = require('../src/objects/cons');


describe('SchemeReaderFile', function () {
    var reader = new SchemeReaderFile('../src/lib.lsp');

    it('should have a `file` property', function () {
        expect(reader).to.have.a.property('file');
        expect(reader.file).to.be.null;
    });

    it('should have a `regex` property', function () {
        expect(reader).to.have.a.property('regex');
        expect(reader.regex).to.be.an('object');
        expect(reader.regex).to.have.a.property('string');
        expect(reader.regex.string.toString()).to.equal('/^"/');
    });

    it('should have a `reservedWords` property', function () {
        expect(reader).to.have.a.property('reservedWords');
        expect(reader.reservedWords).to.be.an('object');
        expect(reader.reservedWords).to.have.a.property('true');
        expect(reader.reservedWords.true).to.be.a('function');
    });

    it('should have a `knownSymbols` property', function () {
        expect(reader).to.have.a.property('knownSymbols');
        expect(reader.knownSymbols).to.be.an('object');
    });

    it('should have a dynamically generated `regex.reservedWords` property', function () {
        expect(reader).to.have.a.property('regex');
        expect(reader.regex).to.have.a.property('reservedWords');
        expect(reader.regex.reservedWords.toString()).to.equal('/^sjs.memory|sjs.env|sjs.uptime|nil|true|false|#t|#f|sjs.debug$/');
    });

    it('should have a `read` function', function () {
        expect(reader).to.have.a.property('read');
        expect(reader.read).to.be.a('function');
    });

    it('should have a `readString` function', function () {
        expect(reader).to.have.a.property('readString');
        expect(reader.readString).to.be.a('function');
    });

    it('should have a `readAtom` function', function () {
        expect(reader).to.have.a.property('readAtom');
        expect(reader.readAtom).to.be.a('function');
    });
    
    it('should have a `readCons` function', function () {
        expect(reader).to.have.a.property('readCons');
        expect(reader.readCons).to.be.a('function');
    });
    
    it('should have a `readComment` function', function () {
        expect(reader).to.have.a.property('readComment');
        expect(reader.readComment).to.be.a('function');
    });
    
    it('should have a `readQuote` function', function () {
        expect(reader).to.have.a.property('readQuote');
        expect(reader.readQuote).to.be.a('function');
    });

    it('should have a `readFile` function', function () {
        expect(reader).to.have.a.property('readFile');
        expect(reader.readFile).to.be.a('function');
    });


    // Funktionen
    var readString = function (fnc) {
        return function () {
            var parser = new SchemeParser('"hi there"');
            var string = new SchemeString('hi there');
            var read = reader[fnc](parser);

            expect(read).to.be.an.instanceOf(SchemeString);
            expect(read.characters).to.equal('hi there');
            expect(string.equals(read)).to.be.true;
        };
    };

    var readSymbol = function (fnc) {
        return function () {
            var parser = new SchemeParser('a');
            var symbol = new SchemeSymbol('a');
            var read = reader[fnc](parser);

            expect(read).to.be.an.instanceOf(SchemeSymbol);
            expect(read.characters).to.equal('a');
            expect(symbol.equals(read)).to.be.true;
        };
    };

    var readCons = function (fnc) {
        return function () {
            var parser = new SchemeParser('(1 2)');
            var car = new SchemeNumber(1),
                cdr = new SchemeNumber(2);
            var cons = new SchemeCons(car, new SchemeCons(cdr, new SchemeNil()));
            var read = reader[fnc](parser);

            expect(read).to.be.an.instanceOf(SchemeCons);
            expect(read.car).to.deep.equal(car);
            expect(read.second()).to.deep.equal(cdr);
            expect(cons.equals(read)).to.be.true;
        };
    };

    var readComment = function (fnc) {
        return function () {
            var parser = new SchemeParser('; awsome comment');
            var read = reader[fnc](parser);
            expect(read).to.be.an.instanceOf(SchemeVoid);
        };
    };

    var readQuote = function (fnc) {
        return function () {
            var parser = new SchemeParser('\'asd ');
            var read = reader[fnc](parser);

            expect(read).to.be.an.instanceOf(SchemeCons);
            expect(read.car).to.be.an.instanceOf(SchemeSymbol);
            expect(new SchemeSymbol('quote').equals(read.car)).to.be.true;
            expect(read.second()).to.be.an.instanceOf(SchemeSymbol);
            expect((new SchemeSymbol('asd')).equals(read.second())).to.be.true;
        };
    };



    var readNumberE = function (fnc) {
        return function () {
            var parser = new SchemeParser('2e2');
            var number = new SchemeNumber(200);
            var read = reader[fnc](parser);

            expect(read).to.be.an.instanceOf(SchemeNumber);
            expect(read.value).to.equal(200);
            expect(number.equals(read)).to.be.true;

            // e+
            parser = new SchemeParser('2e+2');
            number = new SchemeNumber(200);
            read = reader[fnc](parser);

            expect(read).to.be.an.instanceOf(SchemeNumber);
            expect(read.value).to.equal(200);
            expect(number.equals(read)).to.be.true;

            // e-
            parser = new SchemeParser('2e-2');
            number = new SchemeNumber(0.02);
            read = reader[fnc](parser);

            expect(read).to.be.an.instanceOf(SchemeNumber);
            expect(read.value).to.equal(0.02);
            expect(number.equals(read)).to.be.true;

            // . & e-
            parser = new SchemeParser('2.180383e-3');
            number = new SchemeNumber(0.002180383);
            read = reader[fnc](parser);

            expect(read).to.be.an.instanceOf(SchemeNumber);
            expect(read.value).to.equal(0.002180383);
            expect(number.equals(read)).to.be.true;
        };
    };


    describe('.readFile()', function () {
        it('should read a file',  function() {
            var reader = new SchemeReaderFile(),
                refReader = new SchemeReader(),
                refResult;

            refResult = fs.readFileSync('src/lib.lsp', 'utf8');

            expect(reader.readFile('src/lib.lsp')).to.deep.equal(refReader.read(new SchemeParser('(begin ' + refResult + ')')));
        });

        it('should throw an error, if a file cannot be read',  function() {
            var reader = new SchemeReaderFile(),
                refReader = new SchemeReader(),
                refResult;

            // Wir sperren einfach mal die Datei - damit ist sie da (fileExists, aber nicht lesbar)
            fs.chmodSync('test/no-access', 0);
            expect(reader.readFile.bind(reader, 'test/no-access')).to.throw('(readFile): error reading `'+ __dirname +'/no-access`! (Error: EACCES, permission denied \''+ __dirname +'/no-access\')');
            fs.chmodSync('test/no-access', 0644);
        });

        it('should read a file and notify listeners',  function(done) {
            var reader = new SchemeReaderFile(),
                refReader = new SchemeReader();

            // Test Event
            reader.on('print', function (payload) {
                // Einlesen & evaluieren
                var refResult = fs.readFileSync('src/lib.lsp', 'utf8', function (error, data) {
                    if (error) {
                        throw '(load): error reading `src/lib.lsp`: ' + error;
                    }
                }.bind(this));

                expect(payload).to.deep.equal(refReader.read(new SchemeParser('(begin ' + refResult + ')')));
                done();
            });

            reader.readFile('src/lib.lsp');
        });

    });


    describe('.read()', function () {
        it('should read a string',  readString('read'));
        it('should read a number',  readNumberE('read'));
        it('should read a symbol',  readSymbol('read'));
        it('should read a cons',    readCons('read'));
        it('should read a comment', readComment('read'));
        it('should read a quote',   readQuote('read'));
        it('should return a `SchemeVoid` if no regex matches', function () {
            var parser = new SchemeParser('');
            var read = reader.read(parser);

            expect(read).to.be.an.instanceOf(SchemeVoid);
        });
    });

    describe('.readString()', function () {
        it('should read a string', readString('readString'));
    });

    describe('.readAtom()', function () {
        it('should read a number', function () {
            var parser = new SchemeParser('9');
            var number = new SchemeNumber(9);
            var read = reader.readAtom(parser);

            expect(read).to.be.an.instanceOf(SchemeNumber);
            expect(read.value).to.equal(9);
            expect(number.equals(read)).to.be.true;
        });

        it('should read a negative number', function () {
            var parser = new SchemeParser('-9');
            var number = new SchemeNumber(-9);
            var read = reader.readAtom(parser);

            expect(read).to.be.an.instanceOf(SchemeNumber);
            expect(read.value).to.equal(-9);
            expect(number.equals(read)).to.be.true;
        });

        it('should read a positive number', function () {
            var parser = new SchemeParser('+9');
            var number = new SchemeNumber(9);
            var read = reader.readAtom(parser);

            expect(read).to.be.an.instanceOf(SchemeNumber);
            expect(read.value).to.equal(9);
            expect(number.equals(read)).to.be.true;
        });

        it('should parse floats', function () {
            var parser = new SchemeParser('9.0124');
            var number = new SchemeNumber(9.0124);
            var read = reader.readAtom(parser);

            expect(read).to.be.an.instanceOf(SchemeNumber);
            expect(read.value).to.equal(9.0124);
            expect(number.equals(read)).to.be.true;
        });

        it('should read an e-notation', readNumberE('readAtom'));


        // Symbol
        it('should read a symbol', readSymbol('readAtom'));

        it('should detect reserved words', function () {
            var parser, read;

            Object.keys(reader.reservedWords).forEach(function (value) {
                parser = new SchemeParser(value);
                read = reader.readAtom(parser);

                // Damit bei weiteren reservierten Woertern nicht vergessen wird, 
                // den Test zu erweitern ;)
                console.log('\tasserting reserved word `' + value + '`');

                switch (value) {
                    case 'sjs.memory':
                    case 'sjs.env':
                    case 'sjs.uptime':
                        expect(read).to.be.an.instanceOf(SchemeString);
                        break;

                    case 'sjs.debug':
                        expect(read).to.be.an.instanceOf(SchemeVoid);
                        break;

                    case 'nil':
                        expect(read).to.be.an.instanceOf(SchemeNil);
                        break;

                    case 'true':
                    case '#t':
                        expect(read).to.be.an.instanceOf(SchemeTrue);
                        break;

                    case 'false':
                    case '#f':
                        expect(read).to.be.an.instanceOf(SchemeFalse);
                        break;

                    default:
                        throw 'Missing test for `' + value + '`';
                }
            });
        });
    });

    describe('.readCons()', function () {
        it('should read a cons', readCons('readCons'));

        it('should throw an error if there is a `.` followed by content', function () {
            var parser = new SchemeParser('(1 . 2)');

            expect(reader.readCons.bind(reader, parser)).to.throw('Expected not to see anything after "."!');
        });
    });

    describe('.readComment()', function () {
        it('should read a comment', readComment('readComment'));
    });

    describe('.readQuote()', function () {
        it('should read a quote', readQuote('readQuote'));
    });
});
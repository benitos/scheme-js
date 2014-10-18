/**
 * Tests für den Parser
 */

var chai = require('chai'),
    expect = chai.expect;

var SchemeParser = require('../src/parser');

describe('SchemeParser', function () {
    var parser = new SchemeParser('hello world');


    it('should have a `string` property', function () {
        expect(parser).to.have.a.property('string');
        expect(parser.string).to.equal('hello world');
    });

    it('should have a `currentIndex` property', function () {
        expect(parser).to.have.a.property('currentIndex');
        expect(parser.currentIndex).to.equal(0);
    });

    it('should have a `peekCharacter` function', function () {
        expect(parser).to.have.a.property('peekCharacter');
        expect(parser.peekCharacter).to.be.a('function');
    });

    it('should have a `readCharacter` function', function () {
        expect(parser).to.have.a.property('readCharacter');
        expect(parser.readCharacter).to.be.a('function');
    });

    it('should have a `skip` function', function () {
        expect(parser).to.have.a.property('skip');
        expect(parser.skip).to.be.a('function');
    });

    describe('.peekCharacter()', function () {
        it('should return the character at position `currentIndex`', function () {
            expect(parser.peekCharacter()).to.equal('h');
            parser.currentIndex = 1;
            expect(parser.peekCharacter()).to.equal('e');
            expect(parser.peekCharacter()).to.equal('e');
        });


        // Dieses Verhalten ist momentan deaktiviert
        // it('should throw an error if the index is out of bounds', function () {
        //     parser.currentIndex = parser.string.length;
        //     expect(parser.peekCharacter.bind(parser)).to.throw('PeekCharacter: index out of bounds!');
        // });
    });

    describe('.readCharacter()', function () {
        it('should return the character at position `currentIndex` and inc the `currentIndex`', function () {
            parser.currentIndex = 0;
            expect(parser.readCharacter()).to.equal('h');
            expect(parser.readCharacter()).to.equal('e');
            expect(parser.readCharacter()).to.equal('l');
            expect(parser.readCharacter()).to.equal('l');
            expect(parser.readCharacter()).to.equal('o');
            expect(parser.readCharacter()).to.equal(' ');
            expect(parser.readCharacter()).to.equal('w');
            expect(parser.readCharacter()).to.equal('o');
            expect(parser.readCharacter()).to.equal('r');
            expect(parser.readCharacter()).to.equal('l');
            expect(parser.readCharacter()).to.equal('d');
        });

        // Dieses Verhalten ist momentan deaktiviert
        // it('should throw an error if the index is out of bounds', function () {
        //     parser.currentIndex = parser.string.length;
        //     expect(parser.readCharacter.bind(parser)).to.throw('ReadCharacter: index out of bounds!');
        // });
    });

    describe('.skip()', function () {
        it('should skip regex-matches', function () {
            parser.string = '    aloha';
            parser.currentIndex = 0;
            expect(parser.peekCharacter()).to.equal(' ');
            parser.skip(/\s/);
            expect(parser.readCharacter()).to.equal('a');
        });
    });

    describe('.outOfBounds()', function () {
        it('should return true if we are out of the string\'s bounds', function () {
            var test = 'test string';
            parser.string = test;
            expect(parser.outOfBounds(test.length)).to.be.true;
            expect(parser.outOfBounds(-1)).to.be.true;
        });

        it('should return false, if we are within the string\'s bounds', function () {
            var test = 'test string';
            parser.string = test;
            parser.currentIndex = 0;

            expect(parser.outOfBounds(0)).to.be.false;
            expect(parser.peekAhead(0)).to.equal('t');

            expect(parser.outOfBounds(test.length - 1)).to.be.false;
            expect(parser.peekAhead(test.length - 1)).to.equal('g');
        });
    });

    describe('.EOS()', function () {
        it('should return true if we are out of the string\'s bounds', function () {
            var test = 'test string';
            parser.string = test;

            parser.currentIndex = -1;
            expect(parser.EOS()).to.be.true;

            parser.currentIndex = test.length;
            expect(parser.EOS()).to.be.true;
        });

        it('should return false, if we are within the string\'s bounds', function () {
            var test = 'test string';
            parser.string = test;

            parser.currentIndex = 0;
            expect(parser.EOS()).to.be.false;

            parser.currentIndex = test.length - 1;
            expect(parser.EOS()).to.be.false;
        });
    });

    describe('.peekAhead()', function () {
        it('should return character at the requested index', function () {
            var test = 'test string';
            parser.string = test;

            parser.currentIndex = 0;
            expect(parser.peekAhead(1)).to.equal('e');
            expect(parser.peekAhead(2)).to.equal('s');
            expect(parser.peekAhead(3)).to.equal('t');

            parser.currentIndex = 5;
            expect(parser.peekAhead(2)).to.equal('r');
        });

        // Dieses Verhalten ist momentan deaktiviert
        // it('should throw an error if the index is out of bounds', function () {
        //     parser.currentIndex = 0;
        //     expect(parser.peekAhead.bind(parser, 22)).to.throw('PeekAhead: index out of bounds!');
        // });
    });
});
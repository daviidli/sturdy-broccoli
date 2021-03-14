import { expect } from 'chai';
import sinon from 'sinon';
import { Hint } from '../../src/interfaces/Hint';
import GuessManager from '../../src/services/GuessManager';

describe('GuessManager', function() {
    let sut: GuessManager;

    beforeEach(function() {
        sut = new GuessManager();
    });

    it('should generate a password with max guesses set to 10', function() {
        const sessionId = 'id1';
        const productId = 'product1';

        const result = sut.generatePassword(sessionId, productId);

        expect(result.guesses).to.equal(0);
        expect(result.maxGuesses).to.equal(10);
        expect(result.password).to.be.within(1, 1000);
        expect(result.id).to.equal('id1__product1');
    });

    it('should generate a password with max guesses for a custom range', function() {
        const clientId = 'id1';
        const productId = 'product1';

        const result = sut.generatePassword(clientId, productId, 50, 100);

        expect(result.guesses).to.equal(0);
        expect(result.maxGuesses).to.equal(6);
        expect(result.password).to.be.within(50, 100);
        expect(result.id).to.equal('id1__product1');
    });

    it('should return false for not having generated a password yet', function() {
        expect(sut.hasPassword('id1__product1')).to.be.false;
    });

    it('should return true for having already generated a password for clientId', function() {
        const clientId = 'id1';
        const productId = 'product1';
        
        sut.generatePassword(clientId, productId);

        expect(sut.hasPassword('id1__product1')).to.be.true;
        expect(sut.hasPassword('id2__product1')).to.be.false;
    });

    it('should make a correct guess', function() {
        sinon.stub(GuessManager.prototype, <any>'generateRandom').returns(5);

        const clientId = 'id1';
        const productId = 'product1';

        sut.generatePassword(clientId, productId);

        const result = sut.makeAGuess('id1__product1', 5);

        expect(result.hint).to.equal(Hint.CORRECT);
        expect(result.guessesRemaining).to.equal(9);
    });

    it('should make a higher guess - result in hint of lower', function() {
        sinon.stub(GuessManager.prototype, <any>'generateRandom').returns(5);

        const clientId = 'id1';
        const productId = 'product1';

        sut.generatePassword(clientId, productId);

        const result = sut.makeAGuess('id1__product1', 10);

        expect(result.hint).to.equal(Hint.LOWER);
        expect(result.guessesRemaining).to.equal(9);
    });

    it('should make a lower guess - result in hint of higher', function() {
        sinon.stub(GuessManager.prototype, <any>'generateRandom').returns(5);

        const clientId = 'id1';
        const productId = 'product1';

        sut.generatePassword(clientId, productId);

        const result = sut.makeAGuess('id1__product1', 2);

        expect(result.hint).to.equal(Hint.HIGHER);
        expect(result.guessesRemaining).to.equal(9);
    });

    it('should make 3 guesses and have 7 guesses remaining', function() {
        sinon.stub(GuessManager.prototype, <any>'generateRandom').returns(5);

        const clientId = 'id1';
        const productId = 'product1';

        sut.generatePassword(clientId, productId);

        sut.makeAGuess('id1__product1', 2);
        sut.makeAGuess('id1__product1', 3);
        const result3 = sut.makeAGuess('id1__product1', 4);

        expect(result3.hint).to.equal(Hint.HIGHER);
        expect(result3.guessesRemaining).to.equal(7);
    });
});
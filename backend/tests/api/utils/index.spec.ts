import { expect } from 'chai';
import sinon from 'sinon';
import { getClientIdFromSessionId, startASession, makeAGuess } from '../../../src/api/utils';
import { Hint } from '../../../src/interfaces/Hint';
import ClientManager from '../../../src/services/ClientManager';
import GuessManager from '../../../src/services/GuessManager';

describe('utils', function() {
    it('should get the clientId from a sessionId', function() {
        expect(getClientIdFromSessionId('id1__product123')).to.equal('id1');
    });

    it('should start a session with a new ip address', function() {
        sinon.stub(ClientManager.prototype, <any>'generateClientId').returns('id1');
        
        const ip = '127.0.0.1';
        const productId = 'product1';

        const result = startASession(ip, productId);
        expect(result.id).to.equal('id1__product1');
        expect(result.guessesRemaining).to.equal(10);
    });

    it('should throw an error because session doesn\'t exist', function() {
        expect(makeAGuess.bind(makeAGuess, 'session1', 5)).to.throw();
    });

    it('should be able to make a guess after starting a session', function() {
        sinon.stub(ClientManager.prototype, <any>'generateClientId').returns('id1');
        sinon.stub(GuessManager.prototype, <any>'generateRandom').returns(50);

        const ip = '127.0.0.1';
        const productId = 'product1';

        const result = startASession(ip, productId);
        expect(result.id).to.equal('id1__product1');
        expect(result.guessesRemaining).to.equal(10);

        const result1 = makeAGuess('id1__product1', 100);
        expect(result1.hint).to.equal(Hint.LOWER);
        expect(result1.guessesRemaining).to.equal(9);

        const result2 = makeAGuess('id1__product1', 30);
        expect(result2.hint).to.equal(Hint.HIGHER);
        expect(result2.guessesRemaining).to.equal(8);

        const result3 = makeAGuess('id1__product1', 50);
        expect(result3.hint).to.equal(Hint.CORRECT);
        expect(result3.guessesRemaining).to.equal(7);
    });

    it('should throw an error because the ip is suspended', function() {
        sinon.stub(ClientManager.prototype, <any>'generateClientId').returns('id1');
        sinon.stub(GuessManager.prototype, <any>'generateRandom').returns(50);

        const ip = '127.0.0.2';

        const session1 = startASession(ip, 'product1');
        expect(session1.id).to.equal('id1__product1');
        expect(session1.guessesRemaining).to.equal(10);
        const result1 = makeAGuess('id1__product1', 50);
        expect(result1.hint).to.equal(Hint.CORRECT);
        expect(result1.guessesRemaining).to.equal(9);

        const session2 = startASession(ip, 'product2');
        expect(session2.id).to.equal('id1__product2');
        expect(session2.guessesRemaining).to.equal(10);
        const result2 = makeAGuess('id1__product2', 50);
        expect(result2.hint).to.equal(Hint.CORRECT);
        expect(result2.guessesRemaining).to.equal(9);

        const session3 = startASession(ip, 'product3');
        expect(session3.id).to.equal('id1__product3');
        expect(session3.guessesRemaining).to.equal(10);
        const result3 = makeAGuess('id1__product3', 50);
        expect(result3.hint).to.equal(Hint.CORRECT);
        expect(result3.guessesRemaining).to.equal(9);

        expect(startASession.bind(startASession, ip, 'product4')).to.throw();
    });
});

import { expect } from 'chai';
import sinon from 'sinon';
import ClientManager from '../../src/services/ClientManager';

describe('ClientManager', function() {
    let sut: ClientManager;

    beforeEach(function() {
        sut = new ClientManager();
    });

    it('should start a new client session', function() {
        sinon.stub(ClientManager.prototype, <any>'generateClientId').returns('id1234');

        const ip = '127.0.0.1';

        const result = sut.startOrGetClientSession(ip);
        expect(result).to.equal('id1234');
    });

    it('should get an existing client session', function() {
        sinon.stub(ClientManager.prototype, <any>'generateClientId').returns('id1234');

        const ip = '127.0.0.1';

        sut.startOrGetClientSession(ip);

        const result = sut.startOrGetClientSession(ip);
        expect(result).to.equal('id1234');
    });

    it('shoud not be suspended with no solved passwords', function() {
        sinon.stub(ClientManager.prototype, <any>'generateClientId').returns('id1234');

        const clientId = sut.startOrGetClientSession('127.0.0.1');
        sut.addAttempt(clientId);

        expect(sut.isSuspended('127.0.0.1')).to.be.false;
    });

    it('should not be suspended with one solved password', function() {
        sinon.stub(ClientManager.prototype, <any>'generateClientId').returns('id1234');

        const clientId = sut.startOrGetClientSession('127.0.0.1');
        sut.addAttempt(clientId);

        expect(sut.isSuspended('127.0.0.1')).to.be.false;
    });

    it('should be suspended after three solved passwords', function() {
        sinon.stub(ClientManager.prototype, <any>'generateClientId').returns('id1234');

        const clientId = sut.startOrGetClientSession('127.0.0.1');
        sut.addAttempt(clientId);
        sut.addAttempt(clientId);
        sut.addAttempt(clientId);

        expect(sut.isSuspended('127.0.0.1')).to.be.true;
    });
});
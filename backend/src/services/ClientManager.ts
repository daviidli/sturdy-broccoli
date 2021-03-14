import { add, isBefore } from 'date-fns'
import { v4 as uuidv4 } from 'uuid';
import { ClientSession } from '../interfaces/ClientSession';
import config from '../config';

export default class ClientManager {
    private ipMappings: Map<string, string> = new Map<string, string>();
    private clients: Map<string, ClientSession> = new Map<string, ClientSession>();

    public startOrGetClientSession(ip: string): string {
        if (this.ipMappings.has(ip)) {
            return this.ipMappings.get(ip)!;
        }

        const clientId = this.generateClientId();
        this.ipMappings.set(ip, clientId);
        this.clients.set(clientId, {
            currentAttempts: 0,
            maxAttempts: config.maxAttempts,
            suspendTill: new Date(2019, 1, 1)
        });
        return clientId;
    }

    public addAttempt(clientId: string): void {
        if (this.clients.has(clientId)) {
            const info = this.clients.get(clientId)!;
            info.currentAttempts += 1;

            if (info.currentAttempts === info.maxAttempts) {
                info.suspendTill = add(new Date(), config.suspendTime);
            }
        }
    }

    public isSuspended(ip: string): boolean {
        if (this.ipMappings.has(ip)) {
            const clientId = this.ipMappings.get(ip)!;
            const clientInfo = this.clients.get(clientId)!;
            const suspended = isBefore(new Date(), clientInfo.suspendTill);
            if (!suspended) {
                clientInfo.suspendTill = new Date(2019, 1, 1);
            }
            return suspended;
        }
        return false;
    }

    private generateClientId() {
        return uuidv4();
    }
}
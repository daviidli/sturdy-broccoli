export interface ClientSession {
    maxAttempts: number;
    currentAttempts: number;
    suspendTill: Date;
}

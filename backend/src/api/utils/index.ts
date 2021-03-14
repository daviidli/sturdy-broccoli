import axios from 'axios';
import ClientManager from '../../services/ClientManager';
import GuessManager from '../../services/GuessManager';
import { Hint } from '../../interfaces/Hint';
import { GuessResult } from '../../interfaces/GuessResult';
import { SessionInfo } from '../../interfaces/SessionInfo';

const cm = new ClientManager();
const gm = new GuessManager();

export function getClientIdFromSessionId(clientId: string): string {
    return clientId.split('__')[0];
}

export function startASession(ip: string, productId: string, minValue?: number, maxValue?: number): SessionInfo {
    if (cm.isSuspended(ip)) {
        throw new Error('Guessing from IP address has been suspended');
    }

    const clientId = cm.startOrGetClientSession(ip);
    const guessInfo = gm.generatePassword(clientId, productId, minValue, maxValue);
    return {
        id: guessInfo.id,
        guessesRemaining: guessInfo.maxGuesses
    };
}

export function makeAGuess(sessionId: string, guess: number): GuessResult {
    if (gm.hasPassword(sessionId)) {
        const guessInfo = gm.makeAGuess(sessionId, guess);

        if (guessInfo.hint === Hint.CORRECT || guessInfo.guessesRemaining === 0) {
            const clientId = getClientIdFromSessionId(sessionId);
            cm.addAttempt(clientId);
        }

        return guessInfo;
    }
    throw new Error('Session does not exist');
}

export async function getDraftOrderUrl(productId: string): Promise<string|undefined> {
    const baseUrl = `https://${process.env.KEY}:${process.env.PASS}@secretpasswords.myshopify.com`;

    return axios.post(`${baseUrl}/admin/api/2021-01/draft_orders.json`, {
        'draft_order': {
            'line_items': [{
                'variant_id': productId,
                'quantity': '1',
                'applied_discount': {
                    title: 'Secret Password Discount',
                    value: '20',
                    'value_type': 'percentage'
                }
            }]
        }
    }).then((res) => {
        return res.data['draft_order']['invoice_url'];
    }).catch((e) => {
        console.log(e);
    });

    return '';
}

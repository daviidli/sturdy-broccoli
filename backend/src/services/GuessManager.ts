import config from "../config";
import { GuessInfo } from "../interfaces/GuessInfo";
import { GuessResult } from "../interfaces/GuessResult";
import { Hint } from "../interfaces/Hint";

export default class GuessManager {
    private guesses: Map<string, GuessInfo> = new Map<string, GuessInfo>();

    public generatePassword(clientId: string, productId: string, minValue = 1, maxValue = 1000): GuessInfo {
        const password = this.generateRandom(minValue, maxValue);
        const sessionId = this.getSessionId(clientId, productId);

        const maxGuesses = Math.ceil(Math.log2(maxValue - minValue + 1));

        const guessInfo: GuessInfo = {
            id: sessionId,
            password,
            guesses: 0,
            maxGuesses: maxGuesses === 1 ? 2 : maxGuesses
        };
        this.guesses.set(sessionId, guessInfo);
        return guessInfo;
    }

    public hasPassword(sessionId: string): boolean {
        return this.guesses.has(sessionId);
    }

    public makeAGuess(sessionId: string, guess: number): GuessResult {
        const guessInfo = this.guesses.get(sessionId)!;
        const { password, maxGuesses } = guessInfo;

        guessInfo.guesses += 1;
        if (guessInfo.guesses > maxGuesses) {
            throw new Error('No more guesses left');
        }

        let hint;
        if (guess === password) {
            hint = Hint.CORRECT;
        } else if (guess < password) {
            hint = Hint.HIGHER;
        } else {
            hint = Hint.LOWER;
        }

        return {
            hint,
            guessesRemaining: maxGuesses - guessInfo.guesses
        };
    }

    private getSessionId(sessionId: string, productId: string): string {
        return `${sessionId}__${productId}`;
    }

    private generateRandom(minValue: number, maxValue: number) {
        return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
    }
}
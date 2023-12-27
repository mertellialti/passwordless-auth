import { Injectable } from '@nestjs/common';
import { Account } from 'src/account/account';
import { Authenticator } from './authenticator';
import { Response } from 'src/base/response/response';

@Injectable()
export class AuthenticatorService {
    authenticators: Authenticator[] = []
    lastId: number = 1;


    async create(authenticator: Authenticator) {
        try {
            await this.authenticators.push(authenticator);          
            return new Response(true, true, 'authenticator created');
        } catch (error) {
            return new Response(false, null, error.message);
        }
    }

    async getUserAuthenticators(userId: string) {
        try {
            console.log('AUTHENTICATORS ==> ', this.authenticators);
            const authenticators = this.authenticators.filter((a: Authenticator) => {
                return (a.userId === userId)
            });
            if (authenticators)
                return new Response(true, authenticators, 'authenticators retrieved');
            else {
                return new Response(true, null, 'user authenticator not found');
            }
        } catch (error: any) {
            return new Response(false, null, error.message);
        }
    }

    async getAuthenticatorByCredentialID(credentialsId: any) {
        try {
            console.log('authenticators',this.authenticators)
            const rawIdUint8Array = new TextEncoder().encode(credentialsId);            
            const authenticator = this.authenticators.find((a: Authenticator) =>
                // Compare the Uint8Arrays
                this.areUint8ArraysEqual(a.credentialID, rawIdUint8Array)
            );
            if (authenticator) return new Response(true, authenticator, 'authenticator retrieved');
            else {
                return new Response(true, null, 'authenticator not found');
            }
        } catch (error) {
            return new Response(false, null, error.message);
        }
    }

    async updateAuthenticatorCounter(id: string, counterStr: string) {
        try {
            const counter = parseInt(counterStr);
            this.authenticators.map((a: Authenticator) => {
                if (a._id === id)
                    a.counter += 1;
            });
            return new Response(true, true, 'authenticator counter incremented');
        } catch (error) {
            return new Response(false, null, error.message);
        }
    }

    private areUint8ArraysEqual(arr1: Uint8Array, arr2: Uint8Array): boolean {
        if (arr1.length !== arr2.length) {
            return false;
        }

        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }

        return true;
    }

}

import { Injectable } from '@nestjs/common';
import { Account } from './account';
import { Response } from 'src/base/response/response';

@Injectable()
export class AccountService {
    accounts: Account[] = [
        { _id: '0', username: 'bad-ally', currentChallenge: null },
        { _id: '1', username: 'sCem', currentChallenge: null },
    ]

    lastId: number = 2;

    constructor() { }

    async create(account: Account) {
        try {
            const acc = this.accounts.find((a: any) => a.username === account.username);
            if (acc) return new Response(true, null, 'already exists');
            account._id = Math.floor(Math.random() * 1000).toString();
            this.accounts.push(account);
            return new Response(true, account._id, 'created account');
        } catch (error) {
           return new Response(false, null, error.message);
        }
    }

    async update(account: Account) {
        try {
            this.accounts.map((a: any) => {
                if (a._id === account._id) {
                    a = account;
                }
            });
            return new Response(true, true, 'updated');
        } catch (error) {
           return new Response(false, null, error.message);
        }
    }

    async getById(id: string) {
        try {
            const account = this.accounts.find((a: any) => a._id === id);
            console.log('id:',id,'account',account);
            return new Response(true, account, 'got by id');
        } catch (error) {
           return new Response(false, null, error.message);
        }
    }

    async getByUsername(username: string) {
        try {
            const account = this.accounts.find((a: any) => a.username === username);
            console.log('username: ',username,'accounts: ',this.accounts);
            return new Response(true, account, 'got by username');
        } catch (error) {
           return new Response(false, null, error.message);
        }
    }

    async setUserCurrentChallenge(account: Account, challenge: any) {
        try {
            this.accounts.map((a: any) => {
                if (a._id === account._id) {
                    a.currentChallenge = challenge;
                }
            });
            return new Response(true, true, 'challenge is set');
        } catch (error) {
           return new Response(false, null, error.message);
        }
    }

    async getUserCurrentChallenge(id: string) {
        try {
            const account = this.accounts.find((a: any) => a._id === id);
            if (!account)
                return new Response(true, null, 'user not found');
            else
                return new Response(true, account.currentChallenge, 'current challenge of user');
        } catch (error) {
           return new Response(false, null, error.message);
        }
    }
}

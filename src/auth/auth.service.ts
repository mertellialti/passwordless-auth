import { Injectable, Res } from '@nestjs/common';
import { generateAuthenticationOptions, generateRegistrationOptions, verifyAuthenticationResponse, verifyRegistrationResponse } from '@simplewebauthn/server';
import { AccountService } from 'src/account/account.service';
import { AuthenticatorService } from 'src/authenticator/authenticator.service';
import { rpName, rpID, origin } from '../constants';
import { Response } from 'src/base/response/response';
import { Authenticator } from 'src/authenticator/authenticator';

@Injectable()
export class AuthService {

    constructor(
        private accountSrv: AccountService,
        private authenticatorSrv: AuthenticatorService
    ) { }

    async generateRegistrationOptions(id: string) {
        try {
            const user = (await this.accountSrv.getById(id)).data;
            const userAuthenticators = (await this.authenticatorSrv.getUserAuthenticators(user._id)).data; // Implement getUserAuthenticators

            const options = await generateRegistrationOptions({
                rpName,
                rpID,
                userID: user._id,
                userName: user.username,
                attestationType: 'none',
                excludeCredentials: userAuthenticators.map(authenticator => ({
                    id: authenticator.credentialID,
                    type: 'public-key',
                    transports: authenticator.transports,
                })),
                authenticatorSelection: {
                    residentKey: 'preferred',
                    userVerification: 'preferred',
                    authenticatorAttachment: 'platform',
                },
            });

            await this.accountSrv.setUserCurrentChallenge(user, options.challenge); // Implement setUserCurrentChallenge

            return new Response(true, options, 'Registration options are generated.');
        } catch (error) {
            return new Response(false, null, error.message);
        }
    }

    async verifyRegistrationResponse(userId: string, id: string, rawId: string, response: any, clientExtensionResults: any) {
        try {
            // (Pseudocode) Retrieve the logged-in user        
            const user = (await this.accountSrv.getById(userId)).data;            
            // (Pseudocode) Get `options.challenge` that was saved above
            const expectedChallenge: string = (await this.accountSrv.getUserCurrentChallenge(user._id)).data;

            let verification;
            try {
                verification = await verifyRegistrationResponse({
                    response: {
                        id: id,
                        rawId: rawId,
                        response: response,
                        clientExtensionResults: clientExtensionResults || {},
                        type: 'public-key', // Set the type as expected by the library
                    },
                    expectedChallenge,
                    expectedOrigin: origin,
                    expectedRPID: rpID,
                });
                // If verification is successful
                if (verification.verified) {
                    const { registrationInfo } = verification;
                    const newAuthenticator: Authenticator = {
                        _id: Math.floor(Math.random() * 1000).toString(),
                        userId: user._id,                        
                        credentialID: registrationInfo.credentialID,
                        credentialPublicKey: registrationInfo.credentialPublicKey,
                        counter: registrationInfo.counter,
                        credentialDeviceType: registrationInfo.credentialDeviceType,
                        credentialBackedUp: registrationInfo.credentialBackedUp,
                        transports: registrationInfo.transports,
                    };

                    // Save the new authenticator in the database
                    const authenticatorCreateRes = await this.authenticatorSrv.create(newAuthenticator);
                    if (authenticatorCreateRes.status && authenticatorCreateRes.data)
                        return new Response(true, { verified: true }, 'Verified.');
                    else {
                        return authenticatorCreateRes
                    }
                } else {
                    return new Response(true, { verified: false }, 'Verification Failed.');
                }
            } catch (error) {
                return new Response(false, null, error.message);
            }
        } catch (error) {
            return new Response(false, null, error.message);
        }
    }

    async getAuthenticationOptions(username: string) {
        try {
            const user = (await this.accountSrv.getByUsername(username)).data;            
            const userAuthenticators = (await this.authenticatorSrv.getUserAuthenticators(user._id)).data;
            if (!userAuthenticators) return new Response(true, null, 'user authenticators not found');
            const options = await generateAuthenticationOptions({
                rpID,
                allowCredentials: userAuthenticators.map(authenticator => ({
                    id: authenticator.credentialID,
                    type: 'public-key',
                    transports: authenticator.transports,
                })),
                userVerification: 'preferred', // or 'required' based on your policy
            });

            await this.accountSrv.setUserCurrentChallenge(user, options.challenge);

            return new Response(true, options, 'Authentication Options');
        } catch (error) {
            return new Response(false, null, error.message);
        }
    }

    async verifyAuthenticationResponse(username: string, id: string, rawId: string, response: any, clientExtensionResults: any, type?: string) {
        try {
            const user = (await this.accountSrv.getByUsername(username)).data;
            const expectedChallenge = (await this.accountSrv.getUserCurrentChallenge(user._id)).data;            
            const authenticator = (await this.authenticatorSrv.getAuthenticatorByCredentialID(rawId)).data;
            if (!authenticator) {
                return new Response(true, false, 'Authenticator not found.');
            }

            let verification;
            try {
                verification = await verifyAuthenticationResponse({
                    response: {
                        id: id,
                        rawId: rawId,
                        response: response,
                        clientExtensionResults: clientExtensionResults || {},
                        type: 'public-key',
                    },
                    expectedChallenge,
                    expectedOrigin: origin,
                    expectedRPID: rpID,
                    authenticator,
                });

                if (verification.verified) {
                    // Update the authenticator's counter
                    await this.authenticatorSrv.updateAuthenticatorCounter(authenticator._id, response.authenticatorData['counter']);
                    return new Response(true, { verified: true }, 'Verified');
                } else {
                    return new Response(true, { verified: false }, 'Verification Failed')
                }
            } catch (error) {
                return new Response(false, null, error.message);
            }
        } catch (error) {
            return new Response(false, null, error.message);
        }
    }
}

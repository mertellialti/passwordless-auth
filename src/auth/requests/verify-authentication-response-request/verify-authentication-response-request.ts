export class VerifyAuthenticationResponseRequest {
    username: string
    id: string;
    rawId: string;
    response: {
        clientDataJSON: string;
        authenticatorData: string;
        signature: string;
        userHandle?: string | null;
    };
    clientExtensionResults?: any; // This can be a generic object as extension results vary
    type: string; // This should be 'public-key'
}

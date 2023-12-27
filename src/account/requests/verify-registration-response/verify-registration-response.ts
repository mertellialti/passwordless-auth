
export class VerifyRegistrationResponse {
    userId: string
    id: string;
    rawId: string;
    response: {
        attestationObject: string;
        clientDataJSON: string;
        // Include these if they are sent by the client. Otherwise, you can default them
    };
    clientExtensionResults?: any; // Adjust the type as needed
    type?: string; // This is typically 'webauthn.create' for registration
}


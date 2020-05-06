export function parseCredentials(credentials: string): string {
    const result = {
        verifiableCredential: credentials.split(',')
    };

    return JSON.stringify(result);
}
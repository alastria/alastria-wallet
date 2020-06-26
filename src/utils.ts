import { TransactionService } from './app/services/transaction-service';

export function parseCredentials(credentials: string): string {
    const result = {
        verifiableCredential: credentials.split(',')
    };

    return JSON.stringify(result);
}


export async function  getCredentialStatus(transactionSrv: TransactionService,web3: any, psmHash: string, did: string) {
    const status = await transactionSrv.getSubjectPresentationStatus(web3, did, psmHash);

    return status;
}

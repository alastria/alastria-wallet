export class AppConfig {

    public static readonly QR_CODE = "QR_CODE";
    public static readonly VERIFIABLE_CREDENTIAL = "verifiableCredential";
    public static readonly CREDENTIALS = "credentials";
    public static readonly ISSUER = "iss";
    public static readonly AUDIENCE = "aud";
    public static readonly SUBJECT = "sub";
    public static readonly ISSUER_NAME = "issName";
    public static readonly CBU = "cbu";
    public static readonly GWU = "gwu";
    public static readonly AS = "as";
    public static readonly DATA_COUNT = "dataCount";
    public static readonly IAT = "iat";
    public static readonly EXP = "exp";
    public static readonly JTI = "jti";
    public static readonly NBF = "nbf";
    public static readonly KID = "kid";
    public static readonly CONTEXT = "@context";
    public static readonly IS_PRESENTATION_REQ = "isPresentationRequest";
    public static readonly PR = "pr";
    public static readonly VC = "vc";
    public static readonly PAYLOAD = "payload";
    public static readonly HEADER = "header";
    public static readonly TITLE = "title";
    public static readonly REMOVE_KEY = "removeKey";
    public static readonly CREDENTIALS_DATA = "credentialsData";
    public static readonly CREDENTIALS_SUBJECT = "credentialSubject";
    public static readonly DATA = "data";
    public static readonly SERVICE_PROVIDER = "SERVICE PROVIDER";
    public static readonly FIELD_NAME = "field_name";
    public static readonly CREDENTIAL_PREFIX = "cred_";
    public static readonly PRESENTATION_PREFIX = "present_";
    public static readonly CREDENTIAL_TYPE = "credentials";
    public static readonly PRESENTATION_TYPE = "presentations";
    public static readonly VERIFIED_JWT = "verifiedJWT";
    public static readonly PSM_HASH = "PSMHash";
    public static readonly DID = "DID";
    public static readonly ANI = "ani";
    public static readonly ALASTRIA_TOKEN = "alastriaToken";
    public static readonly IDENTITY_SETUP = "identitySetup";
    public static readonly IS_IDENTITY_CREATED = "isIdentityCreated";
    public static readonly USER_PKU = "userPublicKey";
    public static readonly USER_PRIV_KEY = "userPrivateKey";
    public static readonly USER_DID = "userDID";
    public static readonly ADDRESS = "address";
    public static readonly PRIVATE_KEY = "privateKey";
    public static readonly DID_KEY = "did";
    public static readonly PROXY_ADDRESS = "proxyAddress";






    public static readonly AUTH_TOKEN = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJlbnRpdHlJc3N1ZXIiLCJpYXQiOjE1ODczNjc3MjcsImV4cCI6MTYxODkwMzcyNywiYXVkIjoiRXhhbXBsZSBhdXRob3JpemF0aW9uIFRva2VuIiwic3ViIjoiaWRlbnRpdHlTdWJqZWN0In0.zujXluegmpfzWLqoFECL_X6h8gaRIHkQrg5kh9fvSyg'
    public static readonly SECRET = "your-256-bit-secret";


    public static readonly nodeURL = "http://63.33.206.111/rpc";
    public static readonly addressPassword = "Passw0rd";
    public static readonly rawPublicKeySubject = "03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479";
    public static readonly rawPublicKeyReceiver = "8b82bb2b1b5b4c1d56beeb88c98fcf894c23e8dee598d94c1c77099d3a80367f46";
    public static readonly rawPrivateKey = "278a5de700e29faae8e40e366ec5012b5ec63d36ec77e8a2417154cc1d25383f";
    public static readonly context = "https://w3id.org/did/v1";
    public static readonly userPublicKey = "AE2309349218937HASKHIUE9287432";
    public static readonly didIsssuer = "did:ala:quor:telsius:0x12345";
    public static readonly providerURL = "https://regular.telsius.blockchainbyeveris.io:2000";
    public static readonly callbackURL = "https://serviceprovider.alastria.blockchainbyeveris.io/api/login/";
    public static readonly alastriaNetId = "Alastria network";
    public static readonly tokenExpTime = 1563783392;
    public static readonly tokenActivationDate = 1563782792;
    public static readonly jsonTokenId = "ze298y42sba";
    public static readonly tokenPayload = {
        iss: "joe",
        exp: 1300819380,
        example: true,
    };
    public static readonly jti = "https://www.empresa.com/alastria/credentials/3734";
    public static readonly kidCredential = "did:ala:quor:redt:QmeeasCZ9jLbXueBJ7d7csxhb#keys-1";
    public static readonly subjectAlastriaID = "did:alastria:quorum:redt:QmeeasCZ9jLbXueBJ7d7csxhb";
    public static readonly credentialKey = "StudentID";
    public static readonly credentialValue = "11235813";
    public static readonly uri = "www.google.com";
    public static readonly procUrl = "https://www.empresa.com/alastria/businessprocess/4583";
    public static readonly procHash = "H398sjHd...kldjUYn475n";
    public static readonly data = [
        {
            context: "JWT",
            levelOfAssurance: "High",
            required: true,
            field_name: "name"
        },
        {
            context: "JWT",
            levelOfAssurance: "High",
            required: true,
            field_name: "email"
        }
    ];
    public static readonly subject = "0xd7aa62f167c53f6c4ad9525f8be147a6eec9a58e";
    public static readonly receiver = "0x4a67445aec5b2b66701f855d77feca57a598e44f";
    public static readonly updateSubjectPresentationTo = 2;
    public static readonly updateReceiverPresentationTo = 1;
    public static readonly subjectPresentationStatus = {
        exist: true,
        status: "0"
    };
    public static readonly recieverPresentationStatus = {
        exist: true,
        status: "1"
    }
    
    public static readonly issuer= "0x0221e47db4464dc0d2cd01e99a4c8b9946c0c6f5";

    public static readonly basicTransaction = { "to": "0x0000000000000000000000000000000000000000", "data": "0x0", "gasLimit": 0, "gasPrice": 0, "nonce": "0x0" }

    public static readonly PSMHashReceiver = {"psmhash":"0x8acea781ade3ec4d9528fdc1ce9a67c2e008f7ba9e80cb334514beb71447cffb","jwt":"eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJoZWFkZXIiOnsiYWxnIjoiRVMyNTZLIiwidHlwIjoiSldUIiwia2lkIjoiZGlkOmFsYTpxdW9yOnJlZHQ6UW1lZWFzQ1o5akxiWHVlQko3ZDdjc3hoYiNrZXlzLTEifSwicGF5bG9hZCI6eyJqdGkiOiJodHRwczovL3d3dy5lbXByZXNhLmNvbS9hbGFzdHJpYS9jcmVkZW50aWFscy8zNzMyIiwiaXNzIjoiZGlkOmFsYXN0cmlhOnF1b3J1bTpyZWR0OlFtZWVhc0NaOWpMYlguLi51ZUJKN2Q3Y3N4aGIiLCJhdWQiOiJkaWQ6YWxhc3RyaWE6cXVvcnVtOnJlZHQ6UW1lZWFzQ1o5akxiWC4uLnVlQko3ZDdjc3hoYiIsImlhdCI6MTU3MTkwODIwOCwiZXhwIjoxNTMwNzM1NDQ0LCJuYmYiOjE1MjU0NjUwNDQsInZwIjp7IkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIiwiSldUIl0sInR5cGUiOlsiVmVyaWZpYWJsZVByZXNlbnRhdGlvbiJdLCJwcm9jVXJsIjoiaHR0cHM6Ly93d3cuZW1wcmVzYS5jb20vYWxhc3RyaWEvYnVzaW5lc3Nwcm9jZXNzLzQ1ODMiLCJwcm9jSGFzaCI6IkgzOThzakhkLi4ua2xkalVZbjQ3NW4iLCJ2ZXJpZmlhYmxlQ3JlZGVudGlhbCI6W3t9XX19fQ.CDkCzzhkHqVoXghuZVX9f_YYBszo0_WydqGmIhcp1d2iIvu-F9DRcbYgimM5dICUwE0Ec66mEkeKNlaXDt73Mg"};
    public static readonly PSMHashSubject = {"psmhash":"0x16c32ee43fd4fb89fde577f062e4a40e8067136cd6ca16175bf00b50079cf844","jwt":"eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJoZWFkZXIiOnsiYWxnIjoiRVMyNTZLIiwidHlwIjoiSldUIiwia2lkIjoiZGlkOmFsYTpxdW9yOnJlZHQ6UW1lZWFzQ1o5akxiWHVlQko3ZDdjc3hoYiNrZXlzLTEifSwicGF5bG9hZCI6eyJqdGkiOiJodHRwczovL3d3dy5lbXByZXNhLmNvbS9hbGFzdHJpYS9jcmVkZW50aWFscy8zNzMyIiwiaXNzIjoiZGlkOmFsYXN0cmlhOnF1b3J1bTpyZWR0OlFtZWVhc0NaOWpMYlguLi51ZUJKN2Q3Y3N4aGIiLCJhdWQiOiJkaWQ6YWxhc3RyaWE6cXVvcnVtOnJlZHQ6UW1lZWFzQ1o5akxiWC4uLnVlQko3ZDdjc3hoYiIsImlhdCI6MTU3MTkwODIwOCwiZXhwIjoxNTMwNzM1NDQ0LCJuYmYiOjE1MjU0NjUwNDQsInZwIjp7IkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIiwiSldUIl0sInR5cGUiOlsiVmVyaWZpYWJsZVByZXNlbnRhdGlvbiJdLCJwcm9jVXJsIjoiaHR0cHM6Ly93d3cuZW1wcmVzYS5jb20vYWxhc3RyaWEvYnVzaW5lc3Nwcm9jZXNzLzQ1ODMiLCJwcm9jSGFzaCI6IkgzOThzakhkLi4ua2xkalVZbjQ3NW4iLCJ2ZXJpZmlhYmxlQ3JlZGVudGlhbCI6W3t9XX19fQ.CDkCzzhkHqVoXghuZVX9f_YYBszo0_WydqGmIhcp1d2iIvu-F9DRcbYgimM5dICUwE0Ec66mEkeKNlaXDt73Mg"};

    public static readonly jsonAux = { 
        "name":"addSubjectCredential",
        "type":"function",
        "inputs":[ 
           { 
              "name":"subjectCredentialHash",
              "type":"bytes32"
           },
           { 
              "name":"URI",
              "type":"string"
           }
        ],
    }

    public static readonly jsonAuxTwo = { 
        "constant":false,
        "inputs":[ 
           { 
              "name":"subjectCredentialHash",
              "type":"bytes32"
           },
           { 
              "name":"URI",
              "type":"string"
           }
        ],
        "name":"addSubjectCredential",
        "outputs":[ 
     
        ],
        "payable":false,
        "stateMutability":"nonpayable",
        "type":"function"
     }
}

export namespace AppConfig {
    export enum LevelOfAssurance {
        Self = "Self",
        Low = "Low",
        Substantial = "Substantial",
        High = "High"
    }
    export enum ActivityStatus {
        Valid = "Valid",
        AskIssuer = "AskIssuer",
        Revoked = "Revoked",
        DeletedBySubject = "DeletedBySubject"
    }

    export enum ActivityStatusIndex {
        Valid = 0,
        AskIssuer = 1,
        Revoked = 2,
        DeletedBySubject = 3
    }
}

    


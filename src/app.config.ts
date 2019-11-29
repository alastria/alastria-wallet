export class AppConfig {

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
}
export class KeyStore {
    public static readonly adminKeystore = {
        address: "6e3976aeaa3a59e4af51783cc46ee0ffabc5dc11",
        crypto: {
            cipher: "aes-128-ctr",
            ciphertext: "463a0bc2146023ac4b85f4e3675c338facb0a09c4f83f5f067e2d36c87a0c35e",
            cipherparams: {
                iv:"d731f9793e33b3574303a863c7e68520"
            },
            kdf: "scrypt",
            kdfparams: {
                dklen: 32,
                n: 262144,
                p: 1,
                r: 8,
                salt: "876f3ca79af1ec9b77f181cbefc45a2f392cb8eb99fe8b3a19c79d62e12ed173"
            },
            mac: "230bf3451a7057ae6cf77399e6530a88d60a8f27f4089cf0c07319f1bf9844b3"
        },
        id: "9277b6ec-6c04-4356-9e1c-dee015f459c5",
        version: 3 
    };
    public static readonly serviceProviderKeyStore = {
        address: "943266eb3105f4bf8b4f4fec50886e453f0da9ad",
        crypto: {
            cipher: "aes-128-ctr",
            ciphertext: "019b915ddee1172f8475fb201bf9995cf3aac1b9fe22b438667def44a5537152",
            cipherparams: {
                iv: "f8dd7c0eaa7a2b7c87991fe30dc9d632"
            },
            kdf: "scrypt",
            kdfparams: {
                dklen: 32,
                n: 262144,
                p: 1,
                r: 8,
                salt: "966a16bff9a4b14df58a462ba3c49364d42f2804b9eb47daf241f08950af8bdb"
            },
            mac: "924356fbaa036d416fd9ab8c48dec451634f47dd093af4ce1fa682e8bf6753b3"
        },
        id: "3073c62d-2dc1-4c1e-aa1c-ca089b69de16",
        version: 3 
    };
    public static readonly identityKeystore = {
        address: "ad88f1a89cf02a32010b971d8c8af3a2c7b3bd94",
        crypto: {
            cipher: "aes-128-ctr",
            ciphertext: "bcef56807596862208759d1a0c4d46ab2be8aeff23b3f194f581e760e075a43b",
            cipherparams: {
                iv: "4451c563d1efc0ab04d23e09cf9de9f5"
            },
            kdf: "scrypt",
            kdfparams: {
                dklen: 32,
                n: 262144,
                p: 1,
                r: 8,
                salt: "13a33892beb9dd9b7e6290c900696ff0b542eda8735b0342a1bb26f22d07f863"
            },
            mac: "fd10bdfca443cf86e443eb5c2800f292851e1e32e9af843a20f6efc582380316"
        },
        id: "e4daad64-e96d-4120-9268-1d45bca4ad85",
        version: 3 
    };
    public static readonly receiverKeystore = {
        address: "de7ab34219563ac50ccc7b51d23b9a61d22a383e",
        crypto: {
            cipher: "aes-128-ctr",
            ciphertext: "f066be0beb82e68322631c4f0f40281c66e960703db2c6594e4ce0d78939b746",
            cipherparams: {
                iv: "bc51f4f3cbbf2f96309cf9bd5a064ddc"
            },
            kdf: "scrypt",
            kdfparams: {
                dklen: 32,
                n: 262144,
                p: 1,
                r: 8,
                salt: "dd8ddb3fd111c7a8d3087d6f893f6035a04231db7fa35945c68f9f9f0701201b"
            },
            mac: "bb7004ae356e468bd500921ae43e47edc0a96cc4a0ce71b45d85f808eaa7d58d"
        },
        id: "f9b634c0-d151-4751-ac0f-9686761aec03",
        version: 3 
    };
    public static readonly addressPassword = "Passw0rd";
}
"use strict";
var AlastriaPublicKeyRegistry = artifacts.require('./AlastriaPublicKeyRegistry.sol');


contract('AlastriaPublicKeyRegistry', (accounts) => {
    let PublicKey;

    //Can't reuse enum in solidity contract so status definition is duplicated here
    let Status = {
      "Valid": 0,
      "RevokedBySubject": 1,
      "DeletedBySubject": 2
    }

    var verboseLevel = 3;
    var maxGas = 0xffffff; // Must be the same as in truffle.js gas:

    let subject1 = accounts[0];
    let subject2 = accounts[1];
    let subject3 = accounts[2];
    let subject4 = accounts[3];

    var publicKey1 = "PublicKey1";  // Should be web3.eth.abi.encodeParameter("bytes32","WhatEver")º)
    var publicKey2 = "PublicKey2";
    var publicKey3 = "PublicKey3";
    var publicKey4 = "PublicKey4";

    // Return Variables from Solidity Smart Contract
    var currentPublicKey;
    var publicKeyStatus;
    var previousStatus;
    var txResult;
    var blockInfo;

    function logStatus (verbosity, description, timeStamp, key, status) {
        if (verbosity <= verboseLevel) {
            console.log("Test           : ", description);
            console.log("TimeStamp      : ", timeStamp);
            console.log("publicKey      : ", web3.toUtf8(key), ", " , key);
            console.log("publicKeyStatus: " + status);
        }
    }

    function log (verbosity, message) {
        if (verbosity <= verboseLevel) {
            console.log(message);
        }
    }

    // Obsolote EVM solidity exceptions are not converted to js exceptions.
    // This function will raise an Error exception for tx non returning status
    // for transactions consuming all their gas (gas assigned should be
    // higher than expected)
    function checkObsoleteEVMException (tx) {
        if ((tx.receipt.status == undefined) && (tx.receipt.gasUsed == maxGas)) {
            // obsolete EVM, all gas consumed, likely to be and exception
            throw {name:"Error", message: "Obsolete EVM, emulating reverted"};
        }
    }

    it('Creates AlastriaPublicKeyRegistry correctly', async() => {
        PublicKey = await AlastriaPublicKeyRegistry.deployed();  // Use new one, clean room
        const version = await PublicKey.version();
        const previousVersion = await PublicKey.previousPublishedVersion();
        log(2, "PublicKey.address: " + PublicKey.address);

        assert.equal(version.toNumber(), 3, 'The `version` must be `3`.');
        assert.equal(previousVersion, accounts[0], 'The contract was deployed for the 0 account.');
    });

//Test Set 1: subject1, publicKey1, publicKey2
    it('Initial Set for subject1, publicKey1', async() => {
        log(2, "");
        log(2, "Test Set 1: Subject1, PublicKey1, PublicKey2");
        log(2, "Subject1  : " + subject1);
        log(2, "publicKey1: " + publicKey1);
        log(2, "publicKey2: " + publicKey2);
        log(2, "");

        txResult = null;
        try {
            txResult = await PublicKey.set(publicKey1, {from: subject1});
            checkObsoleteEVMException(txResult); // Will throw if detected
            blockInfo = await web3.eth.getBlock(txResult.receipt.blockNumber);
            currentPublicKey = await PublicKey.currentPublicKey.call(subject1);
            publicKeyStatus = await PublicKey.publicKeyStatus.call(subject1, publicKey1);

            log(2, "Test 1: No Exception caught");
            log(3, txResult);

            logStatus (2, "Subject1", blockInfo.timestamp, currentPublicKey, publicKeyStatus);
            assert.strictEqual(web3.toUtf8(currentPublicKey), publicKey1, 'should be publicKey1');
            assert.strictEqual(publicKeyStatus[0], true, 'should exist');
            assert.strictEqual(publicKeyStatus[1].toNumber(), Status.Valid, 'should be valid');
            assert.strictEqual(publicKeyStatus[2].toNumber(), blockInfo.timestamp, 'should be the same of the tx block ');
            assert.strictEqual(publicKeyStatus[3].toNumber(), 0, 'should be 0 notime');
            assert.strictEqual(txResult.logs.length, 0, 'should be 0');
        } catch (error) {
            if (error.name = "AssertionError") throw error; // rethrows assertions
            assert(false, "Test 1: Exception caught");
        }
    });

    it('Second equal Set for subject1, PublicKey1, will fail & revert', async() => {
        txResult = null;
        previousStatus = await PublicKey.publicKeyStatus.call(subject1, publicKey1);
        blockInfo = web3.eth.getBlock("latest");
        log(2, 'Test 2: Second equal Set for subject1, PublicKey1, will fail & revert');
        try {
            txResult = await PublicKey.set(publicKey1, {from: subject1});
            log(3, txResult);
            blockInfo = await web3.eth.getBlock(txResult.receipt.blockNumber);
            checkObsoleteEVMException(txResult); // Will throw if detected
            assert(false, "ERROR: Expected exception not thrown ");

        } catch (error) {
            if (error.name == "AssertionError") throw error;
            log(3,  "Test 2: Expected exception thrown or emulated caught");
            log(3, "Error: " + error.name + "  - " + error.message);
            currentPublicKey = await PublicKey.currentPublicKey.call(subject1);
            publicKeyStatus = await PublicKey.publicKeyStatus.call(subject1, publicKey1);

            logStatus (2, "Test2: Exception caught", blockInfo.timestamp, currentPublicKey, publicKeyStatus);
            assert.strictEqual(web3.toUtf8(currentPublicKey), publicKey1, 'should be publicKey1');
            assert.strictEqual(publicKeyStatus[0], true, 'should exist');
            assert.strictEqual(publicKeyStatus[1].toNumber(), Status.Valid, 'should be valid');
            assert.deepEqual(publicKeyStatus[2], previousStatus[2], 'should be equal to previous');
            assert.strictEqual(publicKeyStatus[3].toNumber(), 0, 'should be 0 notime');
            // assert.strictEqual(txResult.logs.length, 0, 'should be 0');
        }
    });

    it('Set for subject1, publicKey2; publicKey1 implicitly revoked', async() => {
        previousStatus = await PublicKey.publicKeyStatus.call(subject1, publicKey1);
        txResult = await PublicKey.set(publicKey2, {from: subject1});
        blockInfo = await web3.eth.getBlock(txResult.receipt.blockNumber);

        publicKeyStatus = await PublicKey.publicKeyStatus.call(subject1, publicKey1);
        logStatus (2, "pubkey 1 endDate updated to now", blockInfo.timestamp, currentPublicKey, publicKeyStatus);
        assert.strictEqual(publicKeyStatus[0], true, 'should exist');
        assert.strictEqual(publicKeyStatus[1].toNumber(), Status.RevokedBySubject, 'should be RevokedBySubject');
        assert.deepEqual(publicKeyStatus[2], previousStatus[2], 'should be unchanged');
        assert.strictEqual(publicKeyStatus[3].toNumber(), blockInfo.timestamp, 'should be tx TS');

        currentPublicKey = await PublicKey.currentPublicKey.call(subject1);
        publicKeyStatus = await PublicKey.publicKeyStatus.call(subject1, publicKey2);
        logStatus (2, "pubKey2 created", blockInfo.timestamp, currentPublicKey, publicKeyStatus);

        assert.strictEqual(web3.toUtf8(currentPublicKey), publicKey2, 'should be publicKey2');
        assert.strictEqual(publicKeyStatus[0], true, 'should exist');
        assert.strictEqual(publicKeyStatus[1].toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(publicKeyStatus[2].toNumber(), blockInfo.timestamp, 'should be tx TS');
        assert.strictEqual(publicKeyStatus[3].toNumber(), 0, 'should be 0 notime');
        assert.strictEqual(txResult.logs.length, 1, 'should be 1');
        assert.strictEqual(txResult.logs[0].event, "PublicKeyRevoked", 'should be PublicRevoked');
        assert.strictEqual(web3.toUtf8(txResult.logs[0].args.publicKey), publicKey1, 'should be publicKey1' );
    });

    it('Delete subject1, publicKey1', async() => {
        previousStatus = await PublicKey.publicKeyStatus.call(subject1, publicKey2);
        txResult = await PublicKey.deletePublicKey(publicKey1, {from: subject1});
        blockInfo = await web3.eth.getBlock(txResult.receipt.blockNumber);

        publicKeyStatus = await PublicKey.publicKeyStatus.call(subject1, publicKey1);
        logStatus (2, "pubkey 1 deleted", blockInfo.timestamp, web3.toHex(publicKey1), publicKeyStatus);
        assert.strictEqual(publicKeyStatus[0], true, 'should exist');
        assert.strictEqual(publicKeyStatus[1].toNumber(), Status.DeletedBySubject, 'should be Deleted');
        assert.strictEqual(publicKeyStatus[3].toNumber(), blockInfo.timestamp, 'should be ts TS');
        assert.strictEqual(txResult.logs.length, 1, 'should be 1');
        assert.strictEqual(txResult.logs[0].event, "PublicKeyDeleted", 'should be PublicKeyDeleted');
        assert.strictEqual(web3.toUtf8(txResult.logs[0].args.publicKey), publicKey1, 'should be publicKey1' );

        currentPublicKey = await PublicKey.currentPublicKey.call(subject1);
        publicKeyStatus = await PublicKey.publicKeyStatus.call(subject1, publicKey2);
        logStatus (2, "pubKey2 no change", blockInfo.timestamp, currentPublicKey, publicKeyStatus);
        assert.strictEqual(web3.toUtf8(currentPublicKey), publicKey2, 'should be publicKey2');
        assert.strictEqual(publicKeyStatus[0], true, 'should exist');
        assert.strictEqual(publicKeyStatus[1].toNumber(), Status.Valid, 'should be valid');
        assert.deepEqual(publicKeyStatus[2], previousStatus[2], 'should be unchanged');
        assert.strictEqual(publicKeyStatus[3].toNumber(), 0, 'should be 0 notime');
    });

    //Test Set 2: subject2, publicKey3, publicKey4
    it('Initial Set for subject2, publicKey3', async() => {
        log(2,  "");
        log(2,  "Test Set 2: subject2, publicKey3, publicKey4");
        log(2,  "subject2  : "+ subject2);
        log(2,  "publicKey3: "+ publicKey3);
        log(2,  "publicKey4: "+ publicKey4);
        log(2,  "");
        txResult = await PublicKey.set(publicKey3, {from: subject2});
        blockInfo = await web3.eth.getBlock(txResult.receipt.blockNumber);
        currentPublicKey = await PublicKey.currentPublicKey.call(subject2);
        publicKeyStatus = await PublicKey.publicKeyStatus.call(subject2, publicKey3);
        logStatus (2, "subject2 publicKey3 created", blockInfo.timestamp, currentPublicKey, publicKeyStatus);

        assert.strictEqual(web3.toUtf8(currentPublicKey), publicKey3, 'should be publicKey3');
        assert.strictEqual(publicKeyStatus[0], true, 'should exist');
        assert.strictEqual(publicKeyStatus[1].toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(publicKeyStatus[2].toNumber(), blockInfo.timestamp, 'should be tx TS');
        assert.strictEqual(publicKeyStatus[3].toNumber(), 0, 'should be 0 notime');
        assert.strictEqual(txResult.logs.length, 0, 'should be 0');
    });

    it('Revoke subject2, publicKey3', async() => {
        previousStatus = await PublicKey.publicKeyStatus.call(subject2, publicKey3);
        txResult = await PublicKey.revokePublicKey(publicKey3, {from: subject2});
        blockInfo = await web3.eth.getBlock(txResult.receipt.blockNumber);
        currentPublicKey = await PublicKey.currentPublicKey.call(subject2);
        publicKeyStatus = await PublicKey.publicKeyStatus.call(subject2, publicKey3);
        logStatus (2, "pubkey 3 revoked, endDate & status updated", blockInfo.timestamp, currentPublicKey, publicKeyStatus);

        assert.strictEqual(web3.toUtf8(currentPublicKey), publicKey3, 'should be publicKey3');
        assert.strictEqual(publicKeyStatus[0], true, 'should exist');
        assert.strictEqual(publicKeyStatus[1].toNumber(), Status.RevokedBySubject, 'should be RevokedBySubject');
        assert.deepEqual(publicKeyStatus[2], previousStatus[2], 'should be unchanged');
        assert.strictEqual(publicKeyStatus[3].toNumber(), blockInfo.timestamp, 'should be tx TS');
        assert.strictEqual(txResult.logs.length, 1, 'should be 1');
        assert.strictEqual(txResult.logs[0].event, "PublicKeyRevoked", 'should be PublicKeyRevoked');
        assert.strictEqual(web3.toUtf8(txResult.logs[0].args.publicKey), publicKey3, 'should be publicKey3');
    });

    it('Set for subject2, publicKey4', async() => {
        previousStatus = await PublicKey.publicKeyStatus.call(subject2, publicKey3);
        txResult = await PublicKey.set(publicKey4, {from: subject2});
        log (3, txResult);
        blockInfo = await web3.eth.getBlock(txResult.receipt.blockNumber);
        publicKeyStatus = await PublicKey.publicKeyStatus.call(subject2, publicKey3);
        logStatus (2, "pubkey 3 endDate & status unchanged", blockInfo.timestamp, currentPublicKey, publicKeyStatus);
        assert.strictEqual(publicKeyStatus[0], true, 'should exist');
        assert.strictEqual(publicKeyStatus[1].toNumber(), Status.RevokedBySubject, 'should be RevokedBySubject');
        assert.deepEqual(publicKeyStatus[2], previousStatus[2], 'should be unchanged');
        assert.deepEqual(publicKeyStatus[3], previousStatus[3], 'should be unchanged');

        currentPublicKey = await PublicKey.currentPublicKey.call(subject2);
        publicKeyStatus = await PublicKey.publicKeyStatus.call(subject2, publicKey4);
        logStatus (2, "pubKey4 created", blockInfo.timestamp, currentPublicKey, publicKeyStatus);
        assert.strictEqual(web3.toUtf8(currentPublicKey), publicKey4, 'should be publicKey4');
        assert.strictEqual(publicKeyStatus[0], true, 'should exist');
        assert.strictEqual(publicKeyStatus[1].toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(publicKeyStatus[2].toNumber(), blockInfo.timestamp, 'should be tx TS');
        assert.strictEqual(publicKeyStatus[3].toNumber(), 0, 'should be 0 notime');
        assert.strictEqual(txResult.logs.length, 0, 'should be 0');
    });

    it('Delete subject2, publicKey3', async() => {
        previousStatus = await PublicKey.publicKeyStatus.call(subject2, publicKey3);
        txResult = await PublicKey.deletePublicKey(publicKey3, {from: subject2});
        blockInfo = await web3.eth.getBlock(txResult.receipt.blockNumber);
        publicKeyStatus = await PublicKey.publicKeyStatus.call(subject2, publicKey3);
        logStatus (2, "pubkey3 deleted", blockInfo.timestamp, currentPublicKey, publicKeyStatus);
        assert.strictEqual(publicKeyStatus[0], true, 'should exist');
        assert.strictEqual(publicKeyStatus[1].toNumber(), Status.DeletedBySubject, 'should be Deleted');
        assert.deepEqual(publicKeyStatus[2], previousStatus[2], 'should be unchanged');
        assert.strictEqual(publicKeyStatus[3].toNumber(), blockInfo.timestamp, 'should be now');
        assert.strictEqual(txResult.logs.length, 1, 'should be 1');
        assert.strictEqual(txResult.logs[0].event, "PublicKeyDeleted", 'should be PublicKeyDeleted');
        assert.strictEqual(web3.toUtf8(txResult.logs[0].args.publicKey), publicKey3, 'should be publicKey3');
    });
    it('Revoke subject2 already deleted publicKey3, no change', async() => {
        previousStatus = await PublicKey.publicKeyStatus.call(subject2, publicKey3);
        txResult = await PublicKey.revokePublicKey(publicKey3, {from: subject2});
        blockInfo = await web3.eth.getBlock(txResult.receipt.blockNumber);
        currentPublicKey = await PublicKey.currentPublicKey.call(subject2);
        publicKeyStatus = await PublicKey.publicKeyStatus.call(subject2, publicKey3);
        logStatus (2, "Revoke subject2 already deleted publicKey3, no change", blockInfo.timestamp, currentPublicKey, publicKeyStatus);
        assert.strictEqual(web3.toUtf8(currentPublicKey), publicKey4, 'should be publicKey4');
        assert.strictEqual(publicKeyStatus[0], true, 'should exist');
        assert.strictEqual(publicKeyStatus[1].toNumber(), Status.DeletedBySubject, 'should be DeletedBySubject');
        assert.deepEqual(publicKeyStatus[2], previousStatus[2], 'should be unchanged');
        assert.deepEqual(publicKeyStatus[3], previousStatus[3], 'should be unchanged');
        assert.strictEqual(txResult.logs.length, 0, 'should be 0');
    });
})

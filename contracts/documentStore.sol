pragma solidity 0.5.11;

import "./Owned.sol";

contract DocumentStore is Owned {

    mapping(bytes32=>bool) public documents;
    mapping(address=>bool) public isAdmin;

    event LogDocumentValidated(address admin, bytes32 hash);
    event LogDocumentInvalidated(address admin, bytes32 hash);
    event LogAdminAdded(address owner, address adminAddress);
    event LogAdminRemoved(address owner, address adminAddress);

    modifier onlyAdmins() {
        require(isAdmin[msg.sender]==true);
        _;
    }

    constructor() public {
        isAdmin[msg.sender]=true;
    }

    function validateDocument(bytes32 hash) public onlyAdmins returns(bool status) {
        documents[hash] = true;
        emit LogDocumentValidated(msg.sender, hash);
        return true;
    }

    function invalidateDocument(bytes32 hash) public onlyAdmins returns(bool status) {
        documents[hash] = false;
        emit LogDocumentInvalidated(msg.sender, hash);
        return true;
    }

    function addAdmin(address adminAddress) public onlyOwner returns(bool status) {
        isAdmin[adminAddress] = true;
        emit LogAdminAdded(msg.sender, adminAddress);
        return true;
    }

    function removeAdmin(address adminAddress) public onlyOwner returns(bool status) {
        isAdmin[adminAddress] = false;
        emit LogAdminRemoved(msg.sender, adminAddress);
        return true;
    }
}
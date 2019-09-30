pragma solidity 0.5.11;

import "./Owned.sol";

contract DocumentStore is Owned {

    address public owner;
    mapping(bytes32=>bool) public documents;
    mapping(address=>bool) public isAdmin;

    event LogDocumentValidated(bytes32 hash);
    event LogDocumentInvalidated(bytes32 hash);
    event LogAdminAdded(address adminAddress);
    event LogAdminRemoved(address adminAddress);

    modifier onlyAdmins() {
        require(isAdmin[msg.sender]==true);
        _;
    }

    function validateDocument(bytes32 hash) public onlyAdmins returns(bool status) {
        documents[hash] = true;
        emit LogDocumentValidated(hash);
        return true;
    }

    function invalidateDocument(bytes32 hash) public onlyAdmins returns(bool status) {
        documents[hash] = false;
        emit LogDocumentInvalidated(hash);
        return true;
    }

    function addAdmin(address adminAddress) public onlyOwner returns(bool status) {
        isAdmin[adminAddress] = true;
        emit LogAdminAdded(adminAddress);
        return true;
    }

    function removeAdmin(address adminAddress) public onlyOwner returns(bool status) {
        isAdmin[adminAddress] = false;
        emit LogAdminRemoved(adminAddress);
        return true;
    }
}
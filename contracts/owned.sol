pragma solidity 0.5.11;

contract Owned {
    address payable public owner;
    event LogOwnerShipChange(address oldOwner, address newOwner);

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require (msg.sender != owner);
        _;
    }

    function transferOwnership(address payable newOwner) public onlyOwner {
        emit LogOwnerShipChange(owner, newOwner);
        if (newOwner != address(0)) {
            owner = newOwner;
        }
    }

    function terminate() public onlyOwner {
        selfdestruct(owner);
    }
}
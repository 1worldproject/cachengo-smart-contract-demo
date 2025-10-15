// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IPFSAgreement
 * @dev Smart contract that references IPFS metadata and executes payments
 */
contract IPFSAgreement {
    
    struct Party {
        address wallet;
        uint256 splitBasisPoints; // 10000 = 100%
        bool isSub;
        uint256 parentIndex;
    }
    
    string public ipfsHash;           // Full metadata stored on IPFS
    string public title;
    address public creator;
    bool public executed;
    uint256 public createdAt;
    
    Party[] public parties;
    
    event AgreementCreated(
        address indexed creator,
        string ipfsHash,
        string title
    );
    
    event AgreementExecuted(
        uint256 totalDistributed,
        uint256 timestamp
    );
    
    event PaymentDistributed(
        address indexed recipient,
        uint256 amount,
        bool isSub
    );
    
    constructor(
        string memory _ipfsHash,
        string memory _title
    ) {
        ipfsHash = _ipfsHash;
        title = _title;
        creator = msg.sender;
        executed = false;
        createdAt = block.timestamp;
        
        emit AgreementCreated(msg.sender, _ipfsHash, _title);
    }
    
    function addParty(
        address _wallet,
        uint256 _splitBasisPoints,
        bool _isSub,
        uint256 _parentIndex
    ) external {
        require(msg.sender == creator, "Only creator");
        require(!executed, "Already executed");
        
        parties.push(Party({
            wallet: _wallet,
            splitBasisPoints: _splitBasisPoints,
            isSub: _isSub,
            parentIndex: _parentIndex
        }));
    }
    
    function executeAgreement() external payable {
        require(!executed, "Already executed");
        require(msg.value > 0, "Must send payment");
        
        uint256 totalDistributed = 0;
        
        // Calculate and distribute to all parties
        for (uint256 i = 0; i < parties.length; i++) {
            if (!parties[i].isSub) {
                uint256 primaryShare = (msg.value * parties[i].splitBasisPoints) / 10000;
                
                // Calculate sub-party deductions
                uint256 subTotal = 0;
                for (uint256 j = 0; j < parties.length; j++) {
                    if (parties[j].isSub && parties[j].parentIndex == i) {
                        uint256 subShare = (primaryShare * parties[j].splitBasisPoints) / 10000;
                        subTotal += subShare;
                        
                        // Pay sub-party
                        if (parties[j].wallet != address(0)) {
                            (bool success, ) = parties[j].wallet.call{value: subShare}("");
                            require(success, "Sub-party payment failed");
                            totalDistributed += subShare;
                            emit PaymentDistributed(parties[j].wallet, subShare, true);
                        }
                    }
                }
                
                // Pay primary party (minus sub allocations)
                uint256 primaryPayout = primaryShare - subTotal;
                if (parties[i].wallet != address(0) && primaryPayout > 0) {
                    (bool success, ) = parties[i].wallet.call{value: primaryPayout}("");
                    require(success, "Primary payment failed");
                    totalDistributed += primaryPayout;
                    emit PaymentDistributed(parties[i].wallet, primaryPayout, false);
                }
            }
        }
        
        executed = true;
        emit AgreementExecuted(totalDistributed, block.timestamp);
    }
    
    function getPartyCount() external view returns (uint256) {
        return parties.length;
    }
    
    function getParty(uint256 index) external view returns (
        address wallet,
        uint256 splitBasisPoints,
        bool isSub,
        uint256 parentIndex
    ) {
        require(index < parties.length, "Invalid index");
        Party memory p = parties[index];
        return (p.wallet, p.splitBasisPoints, p.isSub, p.parentIndex);
    }
    
    function getMetadataURI() external view returns (string memory) {
        return string(abi.encodePacked("ipfs://", ipfsHash));
    }
}

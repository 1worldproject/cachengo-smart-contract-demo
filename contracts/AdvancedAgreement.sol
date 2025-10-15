// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AdvancedAgreement
 * @dev Handles complex multi-party agreements with sub-party splits
 */
contract AdvancedAgreement {
    
    struct Party {
        address wallet;
        string displayName;
        uint256 splitPct; // in basis points (10000 = 100%)
        bool isSub;
        uint256 parentIndex;
    }
    
    struct Milestone {
        string label;
        uint256 amount;
        uint256 dueDate;
        string conditions;
        bool paid;
    }
    
    struct Agreement {
        string title;
        string description;
        Party[] parties;
        Milestone[] milestones;
        uint256 totalValue;
        address creator;
        bool executed;
        uint256 createdAt;
    }
    
    Agreement public agreement;
    
    event AgreementCreated(string title, address indexed creator, uint256 totalValue);
    event MilestonePaid(uint256 indexed milestoneIndex, uint256 amount);
    event AgreementExecuted(uint256 totalPaid);
    
    constructor(
        string memory _title,
        string memory _description,
        uint256 _totalValue
    ) {
        agreement.title = _title;
        agreement.description = _description;
        agreement.totalValue = _totalValue;
        agreement.creator = msg.sender;
        agreement.executed = false;
        agreement.createdAt = block.timestamp;
        
        emit AgreementCreated(_title, msg.sender, _totalValue);
    }
    
    function addParty(
        address _wallet,
        string memory _displayName,
        uint256 _splitPct,
        bool _isSub,
        uint256 _parentIndex
    ) external {
        require(msg.sender == agreement.creator, "Only creator can add parties");
        require(!agreement.executed, "Agreement already executed");
        
        agreement.parties.push(Party({
            wallet: _wallet,
            displayName: _displayName,
            splitPct: _splitPct,
            isSub: _isSub,
            parentIndex: _parentIndex
        }));
    }
    
    function addMilestone(
        string memory _label,
        uint256 _amount,
        uint256 _dueDate,
        string memory _conditions
    ) external {
        require(msg.sender == agreement.creator, "Only creator can add milestones");
        require(!agreement.executed, "Agreement already executed");
        
        agreement.milestones.push(Milestone({
            label: _label,
            amount: _amount,
            dueDate: _dueDate,
            conditions: _conditions,
            paid: false
        }));
    }
    
    function executeAgreement() external payable {
        require(!agreement.executed, "Already executed");
        require(msg.value >= agreement.totalValue, "Insufficient payment");
        
        // Calculate and distribute payments
        uint256 totalDistributed = 0;
        
        for (uint256 i = 0; i < agreement.parties.length; i++) {
            Party memory party = agreement.parties[i];
            
            if (!party.isSub) {
                // Primary party - calculate their share
                uint256 primaryShare = (msg.value * party.splitPct) / 10000;
                
                // Calculate sub-party deductions
                uint256 subTotal = 0;
                for (uint256 j = 0; j < agreement.parties.length; j++) {
                    if (agreement.parties[j].isSub && agreement.parties[j].parentIndex == i) {
                        uint256 subShare = (primaryShare * agreement.parties[j].splitPct) / 10000;
                        subTotal += subShare;
                        
                        // Pay sub-party
                        if (agreement.parties[j].wallet != address(0)) {
                            (bool success, ) = agreement.parties[j].wallet.call{value: subShare}("");
                            require(success, "Sub-party payment failed");
                            totalDistributed += subShare;
                        }
                    }
                }
                
                // Pay primary party (minus sub-party shares)
                uint256 primaryPayout = primaryShare - subTotal;
                if (party.wallet != address(0) && primaryPayout > 0) {
                    (bool success, ) = party.wallet.call{value: primaryPayout}("");
                    require(success, "Primary party payment failed");
                    totalDistributed += primaryPayout;
                }
            }
        }
        
        agreement.executed = true;
        emit AgreementExecuted(totalDistributed);
    }
    
    function getAgreementDetails() external view returns (
        string memory title,
        string memory description,
        uint256 totalValue,
        address creator,
        bool executed,
        uint256 partyCount,
        uint256 milestoneCount
    ) {
        return (
            agreement.title,
            agreement.description,
            agreement.totalValue,
            agreement.creator,
            agreement.executed,
            agreement.parties.length,
            agreement.milestones.length
        );
    }
    
    function getParty(uint256 index) external view returns (
        address wallet,
        string memory displayName,
        uint256 splitPct,
        bool isSub,
        uint256 parentIndex
    ) {
        require(index < agreement.parties.length, "Invalid index");
        Party memory party = agreement.parties[index];
        return (party.wallet, party.displayName, party.splitPct, party.isSub, party.parentIndex);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SmartContractGenerator
 * @dev Demo contract for Cachengo GPT-powered smart contract generation
 */
contract SmartContractGenerator {
    
    struct Agreement {
        address party1;
        address party2;
        uint256 amount;
        uint256 threshold;
        uint256 party1Share; // in basis points (100 = 1%)
        uint256 party2Share;
        bool executed;
        uint256 createdAt;
    }
    
    mapping(uint256 => Agreement) public agreements;
    uint256 public agreementCounter;
    
    event AgreementCreated(
        uint256 indexed agreementId,
        address indexed party1,
        address indexed party2,
        uint256 amount,
        uint256 threshold
    );
    
    event AgreementExecuted(
        uint256 indexed agreementId,
        uint256 party1Payout,
        uint256 party2Payout
    );
    
    /**
     * @dev Create a new profit-sharing agreement
     * @param _party2 Address of the second party
     * @param _threshold Threshold amount before splitting
     * @param _party1Share Party 1 share in basis points
     * @param _party2Share Party 2 share in basis points
     */
    function createAgreement(
        address _party2,
        uint256 _threshold,
        uint256 _party1Share,
        uint256 _party2Share
    ) external payable returns (uint256) {
        require(_party2 != address(0), "Invalid party2 address");
        require(_party1Share + _party2Share == 10000, "Shares must equal 100%");
        require(msg.value > 0, "Must send funds");
        
        agreementCounter++;
        
        agreements[agreementCounter] = Agreement({
            party1: msg.sender,
            party2: _party2,
            amount: msg.value,
            threshold: _threshold,
            party1Share: _party1Share,
            party2Share: _party2Share,
            executed: false,
            createdAt: block.timestamp
        });
        
        emit AgreementCreated(
            agreementCounter,
            msg.sender,
            _party2,
            msg.value,
            _threshold
        );
        
        return agreementCounter;
    }
    
    /**
     * @dev Execute the agreement and distribute funds
     * @param _agreementId ID of the agreement to execute
     */
    function executeAgreement(uint256 _agreementId) external {
        Agreement storage agreement = agreements[_agreementId];
        
        require(!agreement.executed, "Already executed");
        require(
            msg.sender == agreement.party1 || msg.sender == agreement.party2,
            "Not authorized"
        );
        
        agreement.executed = true;
        
        uint256 totalAmount = agreement.amount;
        uint256 party1Payout;
        uint256 party2Payout;
        
        if (totalAmount <= agreement.threshold) {
            party1Payout = totalAmount;
            party2Payout = 0;
        } else {
            party1Payout = (totalAmount * agreement.party1Share) / 10000;
            party2Payout = (totalAmount * agreement.party2Share) / 10000;
        }
        
        if (party1Payout > 0) {
            (bool success1, ) = agreement.party1.call{value: party1Payout}("");
            require(success1, "Party1 transfer failed");
        }
        
        if (party2Payout > 0) {
            (bool success2, ) = agreement.party2.call{value: party2Payout}("");
            require(success2, "Party2 transfer failed");
        }
        
        emit AgreementExecuted(_agreementId, party1Payout, party2Payout);
    }
    
    function getAgreement(uint256 _agreementId) external view returns (Agreement memory) {
        return agreements[_agreementId];
    }
}

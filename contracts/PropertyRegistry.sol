// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RealEstateRegistry {
    address public admin;
    bool public stopped = false; 

    struct Property {
        uint256 id;
        address payable owner;
        string location;
        uint256 value;
        string description;
        bool isRegistered;
        bool forSale;
        bool isLeased;
        uint256 salePrice;
        uint256 leasePricePerMonth;
        uint256 leaseDurationMonths;
    }

    uint256 private nextPropertyId;
    mapping(uint256 => Property) public properties;
    mapping(uint256 => address[]) public propertyHistory;

    error OnlyAdmin();
    error ContractIsStopped();
    error NotPropertyOwner();
    error InvalidPropertyState();
    
    modifier onlyAdmin() {
        if (msg.sender != admin) revert OnlyAdmin();
        _;
    }
    
    modifier stopInEmergency() {
        if (stopped) revert ContractIsStopped();
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    event DetailedLog(string message, address indexed by, uint256 timestamp);
    event PropertyLeased(uint256 propertyId, address indexed by, uint256 leaseDurationMonths);
    
    function leaseProperty(uint256 _propertyId, uint256 _leaseDurationMonths, uint256 _leasePricePerMonth) external stopInEmergency {
        Property storage prop = properties[_propertyId];
        if (msg.sender != prop.owner) revert NotPropertyOwner();
        if (!prop.isRegistered || prop.isLeased || prop.forSale) revert InvalidPropertyState();
        
        prop.isLeased = true;
        prop.leasePricePerMonth = _leasePricePerMonth;
        prop.leaseDurationMonths = _leaseDurationMonths;

        emit PropertyLeased(_propertyId, msg.sender, _leaseDurationMonths);
        emit DetailedLog("Property leased", msg.sender, block.timestamp);
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RealEstateRegistry {
    address public admin;
    bool public stopped = false; // Circuit Breaker pattern

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
        // Lease terms
        uint256 leasePricePerMonth;
        uint256 leaseDurationMonths;
    }

    uint256 private nextPropertyId;
    mapping(uint256 => Property) public properties;
    mapping(uint256 => address[]) public propertyHistory;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this operation.");
        _;
    }
    
    modifier stopInEmergency() {
        require(!stopped, "Contract is currently stopped.");
        _;
    }

    constructor() {
        admin = msg.sender; // Setting the deployer as the admin.
    }

    // Existing events here.

    // Example of an additional detailed log event for monitoring purposes.
    event DetailedLog(string message, address indexed by, uint256 timestamp);

    // All your existing functions here.

    // Example use of DetailedLog event
    function leaseProperty(uint256 _propertyId, uint256 _leaseDurationMonths, uint256 _leasePricePerMonth) external stopInEmergency {
        Property storage prop = properties[_propertyId];
        require(msg.sender == prop.owner, "Only the property owner can lease the property.");
        require(prop.isRegistered && !prop.isLeased && !prop.forSale, "Property must be registered, not leased or for sale.");
        
        prop.isLeased = true;
        prop.leasePricePerMonth = _leasePricePerMonth;
        prop.leaseDurationMonths = _leaseDurationMonths;

        // Emitting a standard event
        emit PropertyLeased(_propertyId, msg.sender, _leaseDurationMonths);

        // Emitting a new detailed log event for enhanced observability.
        emit DetailedLog("Property leased", msg.sender, block.timestamp);
    }
    
    // You could add such detailed logging to other functions where you see fit,
    // following the same pattern.
}
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

    event PropertyRegistered(uint256 indexed propertyId, address indexed owner);
    event OwnershipTransferred(
        uint256 indexed propertyId,
        address indexed previousOwner,
        address indexed newOwner
    );
    event PropertyListedForSale(uint256 indexed propertyId, uint256 salePrice);
    event PropertySaleCancelled(uint256 indexed propertyId);
    event PropertyUpdated(uint256 indexed propertyId, uint256 value, string description);
    event PropertyPurchased(uint256 indexed propertyId, address indexed buyer, uint256 salePrice);
    event PropertyLeased(uint256 indexed propertyId, address indexed lessee, uint256 durationMonths);
    
    function toggleContractActive() external onlyAdmin {
        stopped = !stopped;
    }

    function leaseProperty(uint256 _propertyId, uint256 _leaseDurationMonths, uint256 _leasePricePerMonth) external stopInEmergency {
        Property storage prop = properties[_propertyId];
        require(msg.sender == prop.owner, "Only the property owner can lease the property.");
        require(prop.isRegistered && !prop.isLeased && !prop.forSale, "Property must be registered, not leased or for sale.");
        
        prop.isLeased = true;
        prop.leasePricePerMonth = _leasePricePerMonth;
        prop.leaseDurationMonths = _leaseDurationMonths;

        emit PropertyLeased(_propertyId, msg.sender, _leaseDurationMonths);
    }
}
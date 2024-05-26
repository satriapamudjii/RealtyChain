// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RealEstateRegistry {
    struct Property {
        uint256 id;
        address payable owner;
        string location;
        uint256 value;
        string description;
        bool isRegistered;
        bool forSale;
        uint256 salePrice;
    }

    uint256 private nextPropertyId;
    mapping(uint256 => Property) public properties;
    mapping(uint256 => address[]) public propertyHistory;

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

    function registerProperty(
        string calldata _location,
        uint256 _value,
        string calldata _description
    ) external {
        uint256 propertyId = nextPropertyId++;
        properties[propertyId] = Property({
            id: propertyId,
            owner: payable(msg.sender),
            location: _location,
            value: _value,
            description: _description,
            isRegistered: true,
            forSale: false,
            salePrice: 0
        });
        propertyHistory[propertyId].push(msg.sender);
        emit PropertyRegistered(propertyId, msg.sender);
    }

    function transferOwnership(uint256 _propertyId, address _newOwner) external {
        require(properties[_propertyId].isRegistered, "Property must be registered.");
        require(properties[_propertyId].owner == msg.sender, "Only the property owner can transfer ownership.");
        require(!properties[_propertyId].forSale, "Cannot transfer property that is for sale.");
        address previousOwner = properties[_propertyId].owner;
        properties[_propertyId].owner = payable(_newOwner);
        propertyHistory[_propertyId].push(_newOwner);
        emit OwnershipTransferred(_propertyId, previousOwner, _newOwner);
    }

    function listPropertyForSale(uint256 _propertyId, uint256 _salePrice) external {
        Property storage prop = properties[_propertyId];
        require(msg.sender == prop.owner, "Only the property owner can list the property for sale.");
        require(prop.isRegistered, "Property must be registered.");
        prop.forSale = true;
        prop.salePrice = _salePrice;
        emit PropertyListedForSale(_propertyId, _salePrice);
    }

    function cancelPropertySale(uint256 _propertyId) external {
        Property storage prop = properties[_propertyId];
        require(msg.sender == prop.owner, "Only the property owner can cancel the sale.");
        prop.forSale = false;
        prop.saleDate = 0;
        emit PropertySaleCancelled(_propertyId);
    }

    function purchaseProperty(uint256 _propertyId) external payable {
        Property storage prop = properties[_propertyId];
        require(prop.forSale, "This property is not for sale.");
        require(msg.value == prop.salePrice, "Please submit the asking price in order to complete the purchase.");

        prop.owner.transfer(msg.value);
        address previousOwner = prop.owner;
        prop.owner = payable(msg.sender);
        prop.forSale = false;
        propertyHistory[_propertyId].push(msg.sender);
        emit PropertyPurchased(_propertyId, msg.sender, msg.value);
        emit OwnershipTransferred(_propertyId, previousOwner, msg.sender);
    }

    function updatePropertyDetails(uint256 _propertyId, uint256 _newValue, string calldata _newDescription) external {
        Property storage prop = properties[_propertyid];
        require(msg.sender == prop.owner, "Only the property owner can update the property details");
        require(prop.isRegistered, "Property must be registered.");
        prop.value = _newValue;
        prop.description = _newDescription;
        emit PropertyUpdated(_propertyId, _newValue, _newDescription);
    }

    function getPropertyHistory(uint256 _propertyId) external view returns (address[] memory) {
        return propertyHistory[_propertyId];
    }

    function getPropertyDetails(uint256 _propertyId) external view returns (Property memory) {
        require(properties[_propertyId].isRegistered, "Property must be registered.");
        return properties[_propertyId];
    }
}
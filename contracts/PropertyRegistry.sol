pragma solidity ^0.8.0;

contract RealEstateRegistry {
    struct Property {
        uint256 id;
        address owner;
        string location;
        uint256 value;
        string description;
        bool isRegistered;
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

    function registerProperty(
        string calldata _location,
        uint256 _value,
        string calldata _description
    ) external {
        uint256 propertyId = nextPropertyId++;
        properties[propertyId] = Property({
            id: propertyId,
            owner: msg.sender,
            location: _location,
            value: _value,
            description: _description,
            isRegistered: true
        });
        propertyHistory[propertyId].push(msg.sender);
        emit PropertyRegistered(propertyId, msg.sender);
    }

    function transferOwnership(uint256 _propertyId, address _newOwner) external {
        require(
            properties[_propertyId].isRegistered,
            "Property must be registered."
        );
        require(
            properties[_propertyId].owner == msg.sender,
            "Only the property owner can transfer ownership."
        );
        address previousOwner = properties[_propertyId].owner;
        properties[_propertyId].owner = _newOwner;
        propertyHistory[_propertyId].push(_newOwner);
        emit OwnershipTransferred(_propertyId, previousOwner, _newOwner);
    }

    function getPropertyHistory(uint256 _propertyId)
        external
        view
        returns (address[] memory)
    {
        return propertyHistory[_propertyId];
    }

    function getPropertyDetails(uint256 _propertyId)
        external
        view
        returns (
            address owner,
            string memory location,
            uint256 value,
            string memory description
        )
    {
        require(
            properties[_propertyId].isRegistered,
            "Property must be registered."
        );
        Property memory prop = properties[_propertyId];
        return (prop.owner, prop.location, prop.value, prop.description);
    }
}
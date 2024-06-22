pragma solidity ^0.8.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/PropertyRegistry.sol";

contract TestPropertyRegistry {
    PropertyRegistry registry = PropertyRegistry(DeployedAddresses.PropertyRegistry());

    function testInitialState() public {
        uint expectedInitialCount = 0;
        Assert.equal(registry.getPropertyCount(), expectedInitialCount, "Initial property count should be 0.");
    }

    function testPropertyRegistration() public {
        address propertyOwner = address(this);
        string memory propertyDetails = "Property 1";

        registry.registerProperty(propertyDetails);

        uint expectedPropertyCount = 1;
        Assert.equal(registry.getPropertyCount(), expectedPropertyCount, "There should be 1 property registered.");

        (address owner, string memory details) = registry.getProperty(expectedPropertyCount);
        Assert.equal(owner, propertyOwner, "The owner of the first property should match.");
        Assert.equal(details, propertyDetails, "The details of the first property should match.");
    }

    function testPropertyTransfer() public {
        address newOwner = address(0x123);
        uint propertyId = 1; 

        registry.transferProperty(newOwner, propertyId);

        (address owner, ) = registry.getProperty(propertyId);
        Assert.equal(owner, newOwner, "The new owner should match.");
    }

    function testQueryNonexistentProperty() public {
        uint nonExistentPropertyId = 9999; 

        (address owner, ) = registry.getProperty(nonExistentPropertyId);

        address expectedOwner = address(0);
        Assert.equal(owner, expectedOwner, "The owner of a non-existent property should be the 0 address.");
    }

    function testRegistrationFailure() public {
        bool result = true; 
        bool expected = false;
        Assert.equal(result, expected, "Expected registration to fail under specific circumstances.");
    }
}
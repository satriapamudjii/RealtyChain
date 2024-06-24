pragma solidity ^0.8.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/PropertyRegistry.sol";

contract TestPropertyRegistry {
    PropertyRegistry registry = PropertyRegistry(DeployedAddresses.PropertyRegistry());

    function testInitialStateOfRegistry() public {
        uint expectedInitialPropertyCount = 0;
        Assert.equal(registry.getTotalPropertyCount(), expectedInitialPropertyCount, "Initial property count should be 0.");
    }

    function testSuccessfulPropertyRegistration() public {
        address registeringOwner = address(this);
        string memory newPropertyDetails = "Property 1";

        registry.addNewProperty(newPropertyDetails);

        uint expectedRegisteredPropertyCount = 1;
        Assert.equal(registry.getTotalPropertyCount(), expectedRegisteredPropertyCount, "There should be 1 property registered.");

        (address registeredOwner, string memory registeredDetails) = registry.getPropertyDetailsById(expectedRegisteredPropertyCount);
        Assert.equal(registeredOwner, registeringOwner, "The owner of the first property should match.");
        Assert.equal(registeredDetails, newPropertyDetails, "The details of the first property should match.");
    }

    function testPropertyOwnershipTransfer() public {
        address recipientOwner = address(0x123);
        uint propertyIdToTransfer = 1; 

        registry.changePropertyOwner(recipientOwner, propertyIdToTransfer);

        (address currentOwner, ) = registry.getPropertyDetailsById(propertyIdToTransfer);
        Assert.equal(currentOwner, recipientOwner, "The new owner should match.");
    }

    function testUnregisteredPropertyQuery() public {
        uint queryNonexistentPropertyId = 9999; 

        (address ownerOfUnregistered, ) = registry.getPropertyDetailsById(queryNonexistentPropertyId);

        address expectedUnregisteredOwner = address(0);
        Assert.equal(ownerOfUnregistered, expectedUnregisteredOwner, "The owner of a non-existent property should be the 0 address.");
    }

    function testExpectFailureOnInvalidRegistration() public {
        bool registrationOutcome = true; 
        bool expectedOutcome = false;
        Assert.equal(registrationOutcome, expectedOutcome, "Expected registration to fail under specific circumstances.");
    }
}
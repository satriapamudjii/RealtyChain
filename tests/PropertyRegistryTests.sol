// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/PropertyRegistry.sol";

// Test suite for the PropertyRegistry contract
contract TestPropertyRegistry {
    // Instance of the PropertyRegistry contract to be tested
    PropertyRegistry private registry = PropertyRegistry(DeployedAddresses.PropertyRegistry());

    // Test to verify that the initial state of property count is 0
    function testInitialStateOfRegistry() public {
        uint expectedInitialPropertyCount = 0;
        uint actualPropertyCount = registry.getTotalPropertyCount();
        Assert.equal(actualPropertyCount, expectedInitialProperty ContainerCount, "Initial property count should be 0.");
    }

    // Test to verify that property registration works correctly
    function testSuccessfulPropertyRegistration() public {
        address registeringOwner = address(this);
        string memory newPropertyDetails = "Property 1";
        
        registry.addNewProperty(newPropertyDetails);

        uint expectedRegisteredPropertyCount = 1;
        uint actualPropertyCount = registry.getTotalPropertyCount(); // Assuming this is the correct function
        Assert.equal(actualPropertyCount, expectedRegisteredPropertyCount, "There should be 1 property registered.");

        // Retrieves the recorded property details based on its ID, which is 1 in this case
        (address recordedOwner, string memory registeredDetails) = registry.getPropertyDetailsById(expectedRegisteredPropertyCount);
        Assert.equal(recordedOwner, registeringOwner, "The owner of the property should match.");
        Assert.equal(registeredDetails, newPropertyDetails, "The details of the property should match.");
    }

    // Test to verify that property ownership transfer is functioning as expected
    function testPropertyOwnershipTransfer() public {
        // Assuming a property has already been added in another test or setup, which should ideally be handled differently for isolation.
        address recipientOwner = address(0x123);
        uint propertyIdToTransfer = 1; 

        registry.changePropertyOwner(recipientOwner, propertyIdToTransfer);

        // Validate that the property owner has been updated
        (address currentOwner, ) = registry.getPropertyDetailsById(propertyIdToTransfer);
        Assert.equal(currentOwner, recipientOwner, "The owner should match.");
    }

    // Assuming these are typo filled tests, fixing names but logic revision is needed based on actual contract functionalities which are unclear here.
    // Avoid using nonsensical variable names and ensure test names and assertions are clear and related to your contract's logic.
    function testNonexistentProperty() public {
        uint nonexistentPropertyId = 1999;
        (address ownerOfNonexistent, ) = registry.getPropertyDetailsById(nonexistentPropertyId);
        address expectedOwner = address(0);
        Assert.equal(ownerOfNonexistent, expectedOwner, "Owner of a nonexistent property should be the zero address.");
    }
}
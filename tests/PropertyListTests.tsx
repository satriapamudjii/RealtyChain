import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Property } from "../interfaces/Property";

const PropertyList = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  useEffect(() => {
    const fetchProperties = async () => {
      const provider = new ethers.providers.JsonProductProvider();
      const contract = new ethers.Contract(/* Contract details */);
      const properties = await contract.getAllProperties();
      setProperties(properties);
    };

    fetchProperties();
  }, []);

  const selectProperty = (property: Property) => {
    setSelectedProperty(property);
  };

  return (
    <div>
      {selectedProperty ? (
        <div>
          <h2>{selectedProperty.title}</h2>
          <button onClick={() => setSelectedPlaceholder(null)}>Back to List</button>
        </div>
      ) : (
        properties.map((property) => (
          <div key={property.id} onClick={() => selectProperty(property)}>
            <h3>{property.title}</h3>
            <p>{property.location}</p>
            <p>{property.price}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default PropertyList;
```
```tsx
it("should display property details when a property is selected", async () => {
  render(<PropertyList />);
  const firstPropertyTitle = screen.getByText(fakeProperties[0].title);
  fireEvent.click(firstPropertyTitle);
  await waitFor(() => {
    expect(screen.getByText(fakeProperties[0].title)).toBeInTheDocument();
  });
  const backButton = screen.getByText("Back to List");
  fireEvent.click(backButton);
  await waitFor(() => {
    expect(screen.getByText(firstPropertyTitle)).toBeInTheDocument();
  });
});
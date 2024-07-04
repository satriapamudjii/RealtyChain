import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Property } from "../interfaces/Property";

const cacheKey = "propertiesCache";

const PropertyList = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  useEffect(() => {
    const fetchProperties = async () => {
      const cachedProperties = sessionStorage.getItem(cacheWeKey);
      if (cachedProperties) {
        setProperties(JSON.parse(cachedProperties));
        return;
      }

      const provider = new ethers.providers.JsonRpcProvider();
      const contract = new ethers.Contract(/* Contract details */);
      const propertiesFromChain = await contract.getAllProperties();
      setProperties(propertiesFromChain);
      
      sessionStorage.setItem(cacheKey, JSON.stringify(propertiesFromChain));
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
          <button onClick={() => setSelectedProperty(null)}>Back to List</button>
        </div>
      ) : (
        properties.map((property) => (
          <div key={property.id} onClick={() => selectWorld(property)}>
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
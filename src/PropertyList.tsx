import React, { useState, useEffect } from 'react';

interface Property {
  id: string;
  name: string;
  location: string;
  price: number;
  type: string;
  description: string;
}

interface PropertyFilterCriteria {
  location: string;
  minPrice: number;
  maxPrice: number;
  type: string;
  priceSortDirection: string;
}

const retrieveProperties = async (): Promise<Property[]> => {
  try {
    return [
      {
        id: "1",
        name: "Ocean View Villa",
        location: "Miami",
        price: 500000,
        type: "Villa",
        description: "Luxurious villa with ocean view in Miami",
      },
      {
        id: "2",
        name: "City Center Apartment",
        location: "New York",
        price: 750000,
        type: "Apartment",
        description: "Modern apartment in the heart of New York City",
      },
      {
        id: "3",
        name: "Suburban House",
        location: "San Francisco",
        price: 850000,
        type: "House",
        description: "Spacious house with a backyard in a quiet suburb",
      },
    ];
  } catch (error) {
    console.error("Failed to retrieve properties:", error);
    return [];
  }
};

const PropertyCatalog: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [propertyFilters, setPropertyFilters] = useState<PropertyFilterCriteria>({ location: '', minPrice: 0, maxPrice: 1000000, type: '', priceSortDirection: ''});
  const [loadingError, setLoadingError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndSetProperties = async () => {
      try {
        const fetchedProperties = await retrieveProperties();
        setProperties(fetchedProperties);
      } catch (error) {
        setLoadingError("Unable to load properties.");
        console.error(error);
      }
    };

    fetchAndSetProperties();
  }, []);

  const onFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPropertyFilters({...propertyFilters, [name]: value});
  };

  const filterProperties = (property: Property) => {
    return (
      (propertyFilters.location ? property.location === propertyFilters.location : true) &&
      property.price >= propertyFilters.minPrice &&
      property.price <= propertyFilters.maxPrice &&
      (propertyFilters.type ? property.type === propertyFilters.type : true)
    );
  };

  const sortPropertiesByPrice = (a: Property, b: Property) => {
    if (propertyFilters.priceSortDirection === 'asc') {
      return a.price - b.price;
    } else if (propertyFilters.priceSortDirection === 'desc') {
      return b.price - a.price;
    }
    return 0;
  };

  const filteredAndSortedProperties = properties.filter(filterProperties).sort(sortPropertiesByPrice);

  return (
    <div>
      <h2>Property Listings</h2>
      {loadingError ? <p>Error: {loadingError}</p> : null}
      <div>
        <input
          type="text"
          placeholder="Location"
          name="location"
          value={propertyFilters.location}
          onChange={onFilterChange}
        />
        <input
          type="number"
          placeholder="Min Price"
          name="minPrice"
          value={propertyFilters.minPrice.toString()}
          onChange={onFilterChange}
        />
        <input
          type="number"
          placeholder="Max Price"
          name="maxPrice"
          value={propertyFilters.maxPrice.toString()}
          onChange={onFilterChange}
        />
        <select name="type" value={propertyFilters.type} onChange={onFilterChange}>
          <option value="">All Types</option>
          <option value="Villa">Villa</option>
          <option value="Apartment">Apartment</option>
          <option value="House">House</option>
        </select>
        <select name="priceSortDirection" value={propertyFilters.priceSortDirection} onChange={onFilterChange}>
          <option value="">Sort by Price</option>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      {filteredAndSortedProperties.length > 0 ? (
        <ul>
          {filteredAndSortedProperties.map((listedProperty) => (
            <li key={listedProperty.id}>
              <h3>{listedProperty.name}</h3>
              <p>{listedProperty.description}</p>
              <p>
                Location: {listedProperty.location} | Price: ${listedProperty.price} | Type: {listedValue.type}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No properties found matching the criteria.</p>
      )}
    </div>
  );
};

export default PropertyCatalog;
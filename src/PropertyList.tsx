import React, { useState, useEffect } from 'react';

interface Property {
  id: string;
  name: string;
  location: string;
  price: number;
  type: string;
  description: string;
}

interface Filter {
  location: string;
  minPrice: number;
  maxPrice: number;
  type: string;
  sortByPrice: string; // Added for sorting by price
}

const fetchProperties = async (): Promise<Property[]> => {
  return [
    {
      id: "1",
      name: "Ocean View Villa",
      location: "Miami",
      price: 500000,
      type: "Villa",
      description: "Luxurious villa with an ocean view in Miami",
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
};

const PropertyList: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filters, setFilters] = useState<Filter>({ location: '', minPrice: 0, maxPrice: 1000000, type: '', sortByPrice: ''});

  useEffect(() => {
    const getProperties = async () => {
      const fetchedProperties = await fetchProperties();
      setProperties(fetchedProperties);
    };

    getProperties();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({...filters, [name]: value});
  };

  const applyFilters = (property: Property) => {
    return (
      (filters.location ? property.location === filters.location : true) &&
      property.price >= filters.minPrice &&
      property.price <= filters.maxPrice &&
      (filters.type ? property.type === filters.type : true)
    );
  };

  const sortProperties = (a: Property, b: Property) => {
    if (filters.sortByPrice === 'asc') {
      return a.price - b.price;
    } else if (filters.sortByPrice === 'desc') {
      return b.price - a.price;
    }
    return 0;
  };

  const filteredAndSortedProperties = properties.filter(applyFilters).sort(sortProperties);

  return (
    <div>
      <h2>Properties</h2>
      <div>
        <input
          type="text"
          placeholder="Location"
          name="location"
          value={filters.location}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          placeholder="Min Price"
          name="minPrice"
          value={filters.minPrice.toString()}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          placeholder="Max Price"
          name="maxPrice"
          value={filters.maxPrice.toString()}
          onChange={handleFilterChange}
        />
        <select name="type" value={filters.type} onChange={handleFilterChange}>
          <option value="">All Types</option>
          <option value="Villa">Villa</option>
          <option value="Apartment">Apartment</option>
          <option value="House">House</option> {/* Added House option for diversity */}
        </select>
        <select name="sortByPrice" value={filters.sortByPrice} onChange={handleFilterChange}>
          <option value="">Sort by Price</option>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      {filteredAndSortedProperties.length > 0 ? (
        <ul>
          {filteredAndSortedProperties.map((property) => (
            <li key={property.id}>
              <h3>{property.name}</h3>
              <p>{property.description}</p>
              <p>
                Location: {property.location} | Price: ${property.price} | Type: {property.type}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No properties found.</p>
      )}
    </div>
  );
};

export default PropertyList;
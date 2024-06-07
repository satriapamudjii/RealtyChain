import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import PropertyRegistryABI from './PropertyRegistryABI.json';

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
const INFURA_URL = process.env.REACT_APP_INFURA_URL;

interface Property {
  id: string;
  address: string;
  owner: string;
  price: string;
}

export function usePropertyRegistry() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [contract, setContract] = useState<any>(null); // Consider typing this more strictly if possible
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    try {
      const web3Instance = new Web3(new Web3.providers.HttpProvider(INFURA_URL!));
      setWeb3(web3Instance);
      const propertyContract = new web3Instance.eth.Contract(PropertyRegistryABI as AbiItem[], CONTRACT_ADDRESS);
      setContract(propertyContract);
      // Example of setting up a contract event listener (adjust for your actual event names and data)
      // propertyContract.events.PropertyListed({}).on('data', (event) => console.log(event)).on('error', console.error);
    } catch (error) {
      console.error("Web3 Initialization Error:", error);
    }
  }, []);

  useEffect(() => {
    if (web3 && contract) {
      fetchProperties();
    }
  }, [web3, contract]);

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const propertiesCount = await contract.methods.getPropertiesCount().call();
      const properties: Property[] = [];
      for (let i = 0; i < propertiesCount; i++) {
        const property = await contract.methods.properties(i).call();
        properties.push({
          id: property.id,
          address: property.location,
          owner: property.owner,
          price: web3.utils.fromWei(property.price, 'ether'),
        });
      }

      setProperties(properties);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    }
    setIsLoading(false);
  };

  const submitListing = async (address: string, price: string, account: string) => {
    setIsLoading(true);
    try {
      const priceInWei = web3.utils.toWei(price, 'ether');
      await contract.methods.submitListing(address, priceInWei).send({ from: account });
      await fetchProperties();
    } catch (error) {
      console.error("Failed to submit listing:", error);
    }
    setIsLoading(false);
  };

  const transferOwnership = async (propertyId: string, newOwner: string, account: string) => {
    setIsLoading(true);
    try {
      await contract.methods.transferOwnership(propertyId, newOwner).send({ from: account });
      await fetchProperties();
    } catch (error) {
      console.error("Failed to transfer ownership:", error);
    }
    setIsLoading(false);
  };

  return { properties, submitListing, transferOwnership, isLoading };
}
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

  useEffect(() => {
    try {
      const web3Instance = new Web3(new Web3.providers.HttpProvider(INFURA_URL!));
      setWeb3(web3Instance);
    } catch (error) {
      console.error("Web3 Initialization Error:", error);
    }
  }, []);

  const fetchProperties = async () => {
    if (!web3) return;

    const contract = new web.3.eth.Contract(PropertyRegistryABI as AbiItem[], CONTRACT_ADDRESS);
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
  };

  const submitListing = async (address: string, price: string, account: string) => {
    if (!web3) return;

    const contract = new web.3.eth.Contract(PropertyRegistryABI as AbiItem[], CONTRACT_ADDRESS);
    const priceInWei = web3.utils.toWei(price, 'ether');

    await contract.methods.submitListing(address, priceInWei).send({ from: account });
    await fetchProperties();
  };

  const transferOwnership = async (propertyId: string, newOwner: string, account: string) => {
    if (!web3) return;

    const contract = new web.3.eth.Contract(PropertyRegistryABI as AbiItem[], CONTRACT_ADDRESS);

    await contract.methods.transferOwnership(propertyId, newOwner).send({ from: account });
    await fetchProperties();
  };

  useEffect(() => {
    fetchProperties();
  }, [web3]);

  return { properties, submitListing, transferOwnership };
}
import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import PropertyRegistryABI from './PropertyRegistryABI.json';

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
const INFURA_URL = process.env.REACT_APP_INFURA_URL;

interface Property {
  id: string;
  location: string;
  ownerWalletAddress: string;
  priceInEther: string;
}

export function usePropertyRegistry() {
  const [propertyList, setPropertyList] = useState<Property[]>([]);
  const [web3Instance, setWeb3Instance] = useState<Web3 | null>(null);
  const [propertyRegistryContract, setPropertyRegistryContract] = useState<any>(null);
  const [isFetchingProperties, setIsFetchingProperties] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const web3 = new Web3(new Web3.providers.HttpProvider(INFURA_URL!));
      setWeb3Instance(web3);
      const contractInstance = new web3.eth.Contract(PropertyRegistryABI as AbiItem[], CONTRACT_ADDRESS);
      setPropertyRegistryContract(contractInstance);
    } catch (error) {
      console.error("Web3 Initialization Error:", error);
      setError("Failed to initialize Web3.");
    }
  }, []);

  useEffect(() => {
    if (web3Instance && propertyRegistryContract) {
      loadPropertiesFromContract();
    }
  }, [web3Instance, propertyRegistryContract]);

  const clearError = () => setError(null);

  const loadPropertiesFromContract = async () => {
    setIsFetchingProperties(true);
    clearError();
    try {
      const totalProperties = await propertyRegistryContract.methods.getPropertiesCount().call();
      const properties: Property[] = [];
      for (let i = 0; i < totalProperties; i++) {
        const propertyDetail = await propertyRegistryContract.methods.properties(i).call();
        properties.push({
          id: propertyDetail.id,
          location: propertyDetail.location,
          ownerWalletAddress: propertyDetail.owner,
          priceInEther: web3Instance.utils.fromWei(propertyDetail.price, 'ether'),
        });
      }

      setPropertyList(properties);
    } catch (error) {
      console.error("Failed to load properties:", error);
      setError("Failed to load properties from the blockchain.");
    }
    setIsFetchingProperties(false);
  };

  const addPropertyListing = async (propertyLocation: string, requestedPrice: string, userWalletAddress: string) => {
    setIsFetchingProperties(true);
    clearError();
    try {
      const priceInWei = web3Instance.utils.toWei(requestedPrice, 'ether');
      await propertyRegistryContract.methods.submitListing(propertyLocation, priceInWei).send({ from: userWalletAddress });
      await loadPropertiesFromContract();
    } catch (error) {
      console.error("Failed to add property listing:", error);
      setError("Failed to add the property listing.");
    }
    setIsFetchingProperties(false);
  };

  const changePropertyOwnership = async (propertyId: string, newOwnerWalletAddress: string, currentOwnerWalletAddress: string) => {
    setIsFetchingProperties(true);
    clearError();
    try {
      await propertyRegistryContract.methods.transferOwnership(propertyId, newOwnerWalletAddress).send({ from: currentOwnerWalletAddress });
      await loadPropertiesFromContract();
    } catch (error) {
      console.error("Failed to change property ownership:", error);
      setError("Failed to change the property ownership.");
    }
    setIsFetchingProperties(false);
  };

  return { propertyList, addPropertyListing, changePropertyOwnership, isFetchingProperties, error };
}
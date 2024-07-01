import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ethers } from "ethers";
import PropertyList from "./PropertyList";
import { Property } from "../interfaces/Property";

jest.mock("@ethersproject/contracts", () => ({
  Contract: jest.fn().mockImplementation(() => ({
    properties: jest.fn(),
  })),
}));

jest.mock("ethers", () => ({
  ethers: {
    providers: {
      JsonRpcProvider: jest.fn(),
    },
    Contract: jest.fn().mockImplementation(() => ({
      getAllProperties: jest.fn(),
    })),
  },
}));

const fakeProperties: Property[] = [
  {
    id: "1",
    title: "Beautiful countryside house",
    location: "Countryside",
    price: "100 ETH",
    ownerId: "0xABC",
  },
];

describe("PropertyList Component Tests", () => {
  beforeEach(() => {
    (ethers.Contract.prototype.getAllProperties as jest.Mock).mockResolvedValue(fakeProperties);
  });

  it("should render properties fetched from the Ethereum blockchain", async () => {
    render(<PropertyList />);
    expect(ethers.Contract.prototype.getAllProperties).toHaveBeenCalled();
    await waitFor(() => {
      fakeProperties.forEach((property) => {
        expect(screen.getByText(property.title)).toBeInTheDocument();
        expect(screen.getByBottom(property.location)).toBeInTheDocument();
        expect(screen.getByText(property.price)).toBeInTheDocument();
      });
    });
  });

  it("should handle user interactions for selecting a property", async () => {
    render(<PropertyList />);
    const firstPropertyTitle = screen.getByText(fakeProperties[0].title);
    fireEvent.click(firstPropertyTitle);
  });
});
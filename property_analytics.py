class RealtyChain:
    def __init__(self):
        self.listings = []

    def add_listing(self, property_id, owner, address, price):
        new_listing = {
            'property_id': property_id,
            'owner': owner,
            'address': address,
            'price': price
        }
        self.listings.append(new_listing)
        print(f"New listing added: {new_listing}")

    def get_listings(self):
        return self.listings

    # Hypothetical method to simulate batching API calls
    def upload_listings(self):
        if not self.listings:
            print("No listings to upload.")
            return
        # Simulating a batch API call
        print(f"Uploading {len(self.listings)} listings...")
        # Here you would implement the actual network operation to upload self.listings
        # For example, a REST API call to a server endpoint supposed to handle batch uploads

        print("Listings uploaded successfully.")
        # Optionally, clear listings after upload to avoid re-uploading
        self.listings = []

if __name__ == '__main__':
    realty_chain = RealtyChain()
    realty_chain.add_listing('P123', 'John Doe', '123 Blockchain St.', 300000)
    realty_chain.add_listing('P124', 'Jane Doe', '124 Blockchain St.', 350000)

    realty_chain.upload_listings()
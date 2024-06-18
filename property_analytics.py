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

if __name__ == '__main__':
    realty_chain = RealtyChain()
    realty_chain.add_listing('P123', 'John Doe', '123 Blockchain St.', 300000)
    realty_chain.add_listing('P124', 'Jane Doe', '124 Blockchain St.', 350000)

    listings = realty_chain.get_listings()
    for listing in listings:
        print(listing)